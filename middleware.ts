import { NextRequest, NextResponse } from "next/server";

// Protect most routes by validating Supabase session token and checking user role.
// This middleware is intentionally conservative: it will redirect unauthenticated
// users to /auth and users without the required role to /unauthorized.

const PUBLIC_PATHS = [
  "/",
  "/auth",
  "/api/public",
  "/favicon.ico",
  "/_next",
  "/static",
];

function isPublicPath(pathname: string) {
  // allow paths that start with configured public prefixes
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function getTokenFromCookies(req: NextRequest) {
  // try to discover a Supabase token in cookies. Supabase often stores a
  // JSON string containing access_token in an auth cookie named like
  // sb-<project>-auth-token or similar. We attempt to be flexible.
  for (const [name, cookie] of req.cookies) {
    const v = cookie.value;
    if (!v) continue;

    // if cookie value looks like a JWT return it
    if (v.split && v.split('.').length === 3) return v;

    // try to parse JSON and extract access_token
    try {
      const parsed = JSON.parse(v);
      if (parsed?.access_token) return parsed.access_token;
      if (parsed?.token) return parsed.token;
    } catch (e) {
      // not JSON — continue
    }

    // names that include auth-token are likely to be Supabase tokens
    if (name.toLowerCase().includes('auth-token') || name.toLowerCase().includes('sb-')) {
      // value may be a raw token or JSON; try to return raw value
      if (v.split && v.split('.').length === 3) return v;
    }
  }

  // fallback: check Authorization header
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.replace('Bearer ', '');

  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public assets and next internals
  if (isPublicPath(pathname) || pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
    return NextResponse.next();
  }

  // allow API routes that are explicitly public
  if (pathname.startsWith('/api/public')) return NextResponse.next();

  const token = await getTokenFromCookies(req);
  if (!token) {
    // redirect to auth page and preserve returnTo
    const url = req.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('returnTo', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Validate token via Supabase auth user endpoint
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) return NextResponse.redirect('/auth');

  try {
    const resp = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey || '',
      },
    });

    if (!resp.ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth';
      url.searchParams.set('returnTo', req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }

    const user = await resp.json();

    // determine role — check app_metadata then user_metadata
    const role = user?.app_metadata?.role || user?.user_metadata?.role || null;

    // route-based role checks
    // e.g., /dashboard and /builder require 'creator' role
    if ((pathname.startsWith('/dashboard') || pathname.startsWith('/builder')) && role !== 'creator') {
      return NextResponse.redirect('/unauthorized');
    }

    // user is authenticated and authorized
    return NextResponse.next();
  } catch (err) {
    console.error('Auth middleware error', err);
    const url = req.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }
}

export const config = {
  // run middleware for everything except obvious public assets
  matcher: ['/:path*'],
};
