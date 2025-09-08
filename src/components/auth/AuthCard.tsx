"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Mail, Lock, Hash, ArrowLeft } from "lucide-react";

type AuthCardProps = {
  className?: string;
  role?: "creator" | "public";
  redirectPath?: string;
};

export function AuthCard({ className, role, redirectPath }: AuthCardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<string>("sign-in");
  const [selectedMethod, setSelectedMethod] = React.useState<"email" | "magic" | "aadhaar">("email");

  const handleAuthSuccess = React.useCallback(() => {
    // Get the current user from session storage
    const currentUser = sessionStorage.getItem('currentUser');
    const userRole = currentUser ? JSON.parse(currentUser).role : null;

    // Use the redirectPath if provided
    if (redirectPath) {
      router.push(redirectPath);
      return;
    }

    // Redirect based on user role
    if (userRole === 'admin' || role === 'creator') {
      router.push("/dashboard");
    } else if (userRole === 'public' || role === 'public') {
      router.push("/dashboard/public");
    } else {
      // Default fallback
      router.push("/");
    }
  }, [redirectPath, role, router]);

  return (
    <Card className={cn("w-full max-w-md border-zinc-200/60 dark:border-zinc-800", className)}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-center text-2xl font-semibold tracking-tight">
          {activeTab === "sign-up" ? "Create your account" : "Sign in to your account"}
        </CardTitle>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/" className="hover:underline">Back to home</Link>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            <TabsContent value="sign-in" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <OAuthButtons />
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full justify-center gap-2"
                  onClick={() =>
                    setSelectedMethod((prev) => (prev === "magic" ? "email" : "magic"))
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
                    setSelectedMethod((prev) => (prev === "aadhaar" ? "email" : "aadhaar"))
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

              {selectedMethod === "email" && <EmailPasswordForm mode="sign-in" onSuccess={handleAuthSuccess} />}
              {selectedMethod === "magic" && <MagicLinkBox />}
              {selectedMethod === "aadhaar" && <AadhaarBox mode="sign-in" />}
            </TabsContent>

            <TabsContent value="sign-up" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <OAuthButtons />
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full justify-center gap-2"
                  onClick={() =>
                    setSelectedMethod((prev) => (prev === "magic" ? "email" : "magic"))
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
                    setSelectedMethod((prev) => (prev === "aadhaar" ? "email" : "aadhaar"))
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

              {selectedMethod === "email" && <EmailPasswordForm mode="sign-up" onSuccess={handleAuthSuccess} />}
              {selectedMethod === "magic" && <MagicLinkBox />}
              {selectedMethod === "aadhaar" && <AadhaarBox mode="sign-up" />}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-center text-xs text-muted-foreground">
        <p>
          By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </CardFooter>
    </Card>
  );
}

function OAuthButtons() {
  return (
    <div className="grid grid-cols-1 gap-2">
      <Button variant="outline" className="h-10 w-full justify-center gap-2">
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </Button>
    </div>
  );
}

import { defaultUsers, User } from "../../lib/defaultUsers";

function EmailPasswordForm({ mode, onSuccess }: { mode: "sign-in" | "sign-up"; onSuccess?: () => void }) {
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Simulate API call
    setTimeout(() => {
      try {
        // Find user with matching email and password
        const user = defaultUsers.find(
          (user: User) => user.email === email && user.password === password
        );

        if (user) {
          // Store user in session (in a real app, use proper session management)
          sessionStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }));
          
          onSuccess?.();
        } else {
          setError('Invalid email or password');
        }
      } catch (err) {
        setError('An error occurred during sign in');
        console.error('Auth error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="grid gap-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Email
        </Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          placeholder="you@example.com" 
          required 
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" /> Password
        </Label>
        <Input 
          id="password" 
          name="password"
          type="password" 
          placeholder="********" 
          required 
        />
      </div>
      {mode === "sign-up" && (
        <div className="grid gap-2">
          <Label htmlFor="confirm" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Confirm Password
          </Label>
          <Input id="confirm" name="confirm" type="password" placeholder="********" required />
        </div>
      )}
      <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : mode === "sign-up" ? "Create account" : "Sign in"}
      </Button>
      
    </form>
  );
}

function MagicLinkBox() {
  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="grid gap-2">
        <Label htmlFor="magic-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Magic Link (Supabase)
        </Label>
        <div className="flex gap-2">
          <Input id="magic-email" type="email" placeholder="you@example.com" className="flex-1" />
          <Button type="button" variant="secondary">Send Link</Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">We will email you a one-time sign-in link.</p>
    </div>
  );
}

function AadhaarBox({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="grid gap-2">
        <Label htmlFor="aadhaar" className="flex items-center gap-2">
          <Hash className="h-4 w-4" /> Aadhaar Number
        </Label>
        <div className="flex gap-2">
          <Input id="aadhaar" inputMode="numeric" pattern="[0-9]{12}" placeholder="1234 5678 9012" className="flex-1" />
          <Button type="button" variant="secondary">{mode === "sign-up" ? "Verify" : "Continue"}</Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Enter your 12-digit Aadhaar to proceed.</p>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#EA4335" d="M12 10.2v3.92h5.46c-.24 1.4-1.65 4.1-5.46 4.1-3.29 0-5.98-2.72-5.98-6.08S8.71 6.08 12 6.08c1.88 0 3.14.8 3.86 1.48l2.63-2.54C16.88 3.33 14.62 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.54 0 9.2-3.88 9.2-9.34 0-.63-.07-1.1-.16-1.58H12z" />
    </svg>
  );
}


