"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";

export default function AuthCallbackPage() {
  const supabase = useSupabase();
  const router = useRouter();

  useEffect(() => {
    async function finish() {
      try {
        if (!supabase) return;
        // supabase-js v2 helper
        // prefer high-level helper if available
        if (typeof (supabase.auth as any).getSessionFromUrl === "function") {
          const {
            data: { session, error },
          } = await (supabase.auth as any).getSessionFromUrl({ storeSession: true });
          if (error) {
            console.error("Auth callback error:", error);
            router.replace('/auth');
            return;
          }
          router.replace('/dashboard');
          return;
        }

        // fallback: parse hash fragment for tokens and set session
        const hash = window.location.hash.replace(/^#/, '');
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          router.replace('/dashboard');
          return;
        }

        // if nothing found, redirect to /auth
        router.replace('/auth');
      } catch (err) {
        console.error(err);
        router.replace('/auth');
      }
    }
    finish();
  }, [supabase, router]);

  return <div className="p-8">Completing sign in...</div>;
}
