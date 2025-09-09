import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormFlowLogo } from "@/components/ui/logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FormFlowLogo size="sm" />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold">National Survey Platform</span>
                <span className="text-xs text-muted-foreground">
                  Government of India
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-[#0b57d0]"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/builder">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-[#0b57d0]"
                >
                  Survey Builder
                </Button>
              </Link>
              <Link href="/templates">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-[#0b57d0]"
                >
                  Templates
                </Button>
              </Link>
              <Link href="/settings">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-[#0b57d0]"
                >
                  Settings
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <Link href="/auth?role=creator">
                <Button variant="outline">Admin / Creator Login</Button>
              </Link>
              <Link href="/auth?role=public">
                <Button>Public Login</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-14 space-y-16">
        <section className="grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#0b3d91]">
              Inclusive Smart Surveys for Better Governance
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Collect, validate, and monitor responses across
              India—multi‑language, multi‑channel, and privacy‑first.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth?role=creator">
                <Button className="bg-[#0b57d0] hover:bg-[#0a4ec0] text-white px-8 py-3 text-lg rounded-lg shadow-md">
                  Admin / Creator Login
                </Button>
              </Link>
              <Link href="/auth?role=public">
                <Button
                  variant="outline"
                  className="px-8 py-3 text-lg rounded-lg border-2 border-[#0b57d0] text-[#0b57d0] hover:bg-[#e0e7ff]"
                >
                  Public Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Card className="border-dashed w-full max-w-md bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-lg rounded-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-[#0b3d91]">
                  What is the National Survey Platform?
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Trusted, accessible, and AI‑enabled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed text-gray-700">
                <p>
                  A unified portal for citizen and official surveys—supporting
                  local languages, offline collection, WhatsApp/IVR access, and
                  strong validation to ensure high‑quality datasets.
                </p>
                <p>
                  Creators get a no‑code builder with templates and AI
                  assistance; the public gets a simple, secure experience to
                  participate anytime, anywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight text-[#0b3d91]">
            Key Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the powerful capabilities that make our platform the ideal
            choice for impactful surveys.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#0b57d0]">
                No‑Code Builder
              </CardTitle>
              <CardDescription>
                Templates, Prompt Builder, Chat UI
              </CardDescription>
            </CardHeader>
            <CardContent className="text-base text-gray-700">
              Design complex, logical surveys quickly without code; democratize
              authoring for everyone.
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#0b57d0]">
                Multi‑Channel
              </CardTitle>
              <CardDescription>
                Web, Mobile App, WhatsApp, IVR/Avatars
              </CardDescription>
            </CardHeader>
            <CardContent className="text-base text-gray-700">
              Reach diverse respondents on the channels and bandwidths they
              prefer.
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#0b57d0]">
                Rich Para Data
              </CardTitle>
              <CardDescription>
                Photos, docs, audio, GPS, timestamps
              </CardDescription>
            </CardHeader>
            <CardContent className="text-base text-gray-700">
              Capture validating context alongside answers to boost integrity
              and trust.
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#0b57d0]">
                AI Throughout
              </CardTitle>
              <CardDescription>Validate, translate, auto‑code</CardDescription>
            </CardHeader>
            <CardContent className="text-base text-gray-700">
              Real‑time checks, multilingual support, and open‑text
              standardization streamline data quality.
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#0b57d0]">
                Monitoring
              </CardTitle>
              <CardDescription>Live dashboards & reporting</CardDescription>
            </CardHeader>
            <CardContent className="text-base text-gray-700">
              Track field progress, spot issues early, and download reports for
              actionable insights.
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#0b57d0]">
                Privacy & Consent
              </CardTitle>
              <CardDescription>Secure-by-design data handling</CardDescription>
            </CardHeader>
            <CardContent className="text-base text-gray-700">
              Built with consent management, role‑based access, and audit trails
              for public trust.
            </CardContent>
          </Card>
        </section>

        <Card className="border-dashed bg-gradient-to-r from-blue-50 to-purple-50 p-8 shadow-inner rounded-xl">
          <CardContent className="flex flex-col md:flex-row items-center justify-between py-0 gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-base text-gray-700">
                Ready to get started?
              </div>
              <div className="text-2xl font-bold text-[#0b3d91]">
                Admins build surveys. Citizens participate.
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth?role=creator">
                <Button className="bg-[#0b57d0] hover:bg-[#0a4ec0] text-white px-6 py-3 rounded-lg shadow-md">
                  Admin / Creator Login
                </Button>
              </Link>
              <Link href="/auth?role=public">
                <Button
                  variant="outline"
                  className="px-6 py-3 rounded-lg border-2 border-[#0b57d0] text-[#0b57d0] hover:bg-[#e0e7ff]"
                >
                  Public Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; National Survey Platform · Government of India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
