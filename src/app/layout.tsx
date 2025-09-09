import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { SupabaseProvider } from "@/components/supabase-provider";

export const metadata: Metadata = {
  title: "FormFlow - Survey Generator",
  description: "Create beautiful surveys and forms with drag-and-drop builder",
  generator: "dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <SupabaseProvider>{children}</SupabaseProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
