"use client";

import { HTMLAttributes, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { FormFlowLogo } from "../ui/logo";
import { useSupabase } from "../supabase-provider";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Mail, Lock, Hash } from "lucide-react";

interface AuthCardProps extends HTMLAttributes<HTMLDivElement> {
  redirectPath?: string;
  role?: "creator" | "public";
}

export function AuthCard({
  className,
  redirectPath = "/dashboard",
  role,
  ...props
}: AuthCardProps) {
  const supabase = useSupabase();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<
    "email" | "magic" | "aadhaar"
  >("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!supabase) {
      setMessage({ type: "error", text: "Supabase client not initialized." });
      setLoading(false);
      return;
    }

    let authResponse;

    if (mode === "signup") {
      authResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: role || "public" },
        },
      });
    } else {
      authResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    }

    if (authResponse.error) {
      setMessage({ type: "error", text: authResponse.error.message });
    } else if (authResponse.data.user) {
      // If mode is login, upsert user data. For signup, the database trigger handles this.
      if (mode === "login") {
        const { error: userError } = await supabase.from("users").upsert(
          {
            id: authResponse.data.user.id,
            email: authResponse.data.user.email,
            role: role || "public",
          },
          { onConflict: "id" }
        );

        if (userError) {
          console.error("Error upserting user data during login:", userError);
          setMessage({
            type: "error",
            text: "Error saving user role on login.",
          });
          setLoading(false);
          return;
        }
      }

      setMessage({
        type: "success",
        text:
          mode === "signup"
            ? "Sign up successful! Please check your email for verification."
            : "Login successful!",
      });
      router.push(redirectPath);
    } else if (mode === "signup") {
      setMessage({
        type: "success",
        text: "Sign up successful! Please check your email for verification.",
      });
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto" {...props}>
      <CardHeader className="space-y-1 text-center">
        <FormFlowLogo size="md" />
        <CardTitle className="text-2xl">
          {" "}
          {mode === "login" ? "Log In" : "Sign Up"}
        </CardTitle>
        <CardDescription>
          {role
            ? `Enter your details to ${
                mode === "login" ? "log in" : "sign up"
              } as a ${role}`
            : `Enter your email below to ${
                mode === "login" ? "log in" : "create"
              } your account`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value={mode} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <OAuthButtons />
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full justify-center gap-2"
                onClick={() =>
                  setSelectedMethod((prev) =>
                    prev === "magic" ? "email" : "magic"
                  )
                }
                aria-pressed={selectedMethod === "magic"}
              >
                <Mail className="h-4 w-4" /> Magic Link (Supabase)
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full justify-center gap-2"
                onClick={() =>
                  setSelectedMethod((prev) =>
                    prev === "aadhaar" ? "email" : "aadhaar"
                  )
                }
                aria-pressed={selectedMethod === "aadhaar"}
              >
                <Hash className="h-4 w-4" /> Aadhaar
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                {selectedMethod === "email" ? "Or continue with" : ""}
              </span>
            </div>

            {selectedMethod === "email" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {message && (
                  <div
                    className={`py-2 px-3 rounded-lg text-sm ${
                      message.type === "error"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? "Loading..."
                    : mode === "login"
                    ? "Log In"
                    : "Sign Up"}
                </Button>
              </form>
            )}
            {selectedMethod === "magic" && <MagicLinkBox />}
            {selectedMethod === "aadhaar" && <AadhaarBox mode={mode} />}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="block text-center text-sm text-muted-foreground">
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <Button
          variant="link"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Sign Up" : "Log In"}
        </Button>
        <Link
          href="/"
          className="block text-xs mt-2 text-blue-600 hover:underline"
        >
          ← Back to homepage
        </Link>
      </CardFooter>
    </Card>
  );
}

function OAuthButtons() {
  const supabase = useSupabase();
  const router = useRouter();

  async function signInWithGoogle() {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      alert('Google sign-in failed: ' + error.message);
    }
    // OAuth will redirect to the provider, Supabase will callback to configured redirect URL
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      <Button
        variant="outline"
        className="h-10 w-full justify-center gap-2"
        onClick={signInWithGoogle}
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </Button>
    </div>
  );
}

function MagicLinkBox() {
  const supabase = useSupabase();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  async function sendMagicLink() {
    if (!supabase || !email) return;
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/auth/callback' } });
    if (error) {
      alert('Failed to send magic link: ' + error.message);
    } else {
      alert('Magic link sent. Check your email.');
    }
    setSending(false);
  }

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="grid gap-2">
        <Label htmlFor="magic-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Magic Link (Supabase)
        </Label>
        <div className="flex gap-2">
          <Input
            id="magic-email"
            type="email"
            placeholder="you@example.com"
            className="flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={sendMagicLink} disabled={sending}>
            {sending ? 'Sending...' : 'Send Link'}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        We will email you a one-time sign-in link.
      </p>
    </div>
  );
}

function AadhaarBox({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="grid gap-2">
        <Label htmlFor="aadhaar" className="flex items-center gap-2">
          <Hash className="h-4 w-4" /> Aadhaar Number
        </Label>
        <div className="flex gap-2">
          <Input
            id="aadhaar"
            inputMode="numeric"
            pattern="[0-9]{12}"
            placeholder="1234 5678 9012"
            className="flex-1"
          />
          <Button type="button" variant="secondary">
            {mode === "signup" ? "Verify" : "Continue"}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Enter your 12-digit Aadhaar to proceed.
      </p>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.92h5.46c-.24 1.4-1.65 4.1-5.46 4.1-3.29 0-5.98-2.72-5.98-6.08S8.71 6.08 12 6.08c1.88 0 3.14.8 3.86 1.48l2.63-2.54C16.88 3.33 14.62 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.54 0 9.2-3.88 9.2-9.34 0-.63-.07-1.1-.16-1.58H12z"
      />
    </svg>
  );
}
