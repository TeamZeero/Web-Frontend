import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FormFlowLogo } from "@/components/ui/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-sm bg-[#0b57d0]" />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold">National Survey Platform</span>
                <span className="text-xs text-muted-foreground">Government of India</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
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

      <main className="container mx-auto px-4 py-14 space-y-12">
        <section className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0b3d91]">
              Inclusive Smart Surveys for Better Governance
            </h1>
            <p className="text-lg text-muted-foreground">
              Collect, validate, and monitor responses across India—multi‑language, multi‑channel, and privacy‑first.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth?role=creator">
                <Button className="bg-[#0b57d0] hover:bg-[#0a4ec0]">Admin / Creator Login</Button>
              </Link>
              <Link href="/auth?role=public">
                <Button variant="outline">Public Login</Button>
              </Link>
            </div>
          </div>
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>What is the National Survey Platform?</CardTitle>
              <CardDescription>Trusted, accessible, and AI‑enabled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                A unified portal for citizen and official surveys—supporting local languages, offline collection,
                WhatsApp/IVR access, and strong validation to ensure high‑quality datasets.
              </p>
              <p>
                Creators get a no‑code builder with templates and AI assistance; the public gets a simple, secure
                experience to participate anytime, anywhere.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>No‑Code Builder</CardTitle>
              <CardDescription>Templates, Prompt Builder, Chat UI</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Design complex, logical surveys quickly without code; democratize authoring for everyone.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Multi‑Channel</CardTitle>
              <CardDescription>Web, Mobile App, WhatsApp, IVR/Avatars</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reach diverse respondents on the channels and bandwidths they prefer.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Rich Para Data</CardTitle>
              <CardDescription>Photos, docs, audio, GPS, timestamps</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Capture validating context alongside answers to boost integrity and trust.
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>AI Throughout</CardTitle>
              <CardDescription>Validate, translate, auto‑code</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Real‑time checks, multilingual support, and open‑text standardization streamline data quality.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monitoring</CardTitle>
              <CardDescription>Live dashboards & reporting</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Track field progress, spot issues early, and download reports for actionable insights.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Consent</CardTitle>
              <CardDescription>Secure-by-design data handling</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Built with consent management, role‑based access, and audit trails for public trust.
            </CardContent>
          </Card>
        </section>

        <Card className="border-dashed">
          <CardContent className="py-6 flex flex-wrap items-center gap-3 justify-between">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Choose your portal</div>
              <div className="text-lg font-semibold">Admins build surveys. Citizens participate.</div>
            </div>
            <div className="flex gap-2">
              <Link href="/auth?role=creator">
                <Button className="bg-[#0b57d0] hover:bg-[#0a4ec0]">Admin / Creator Login</Button>
              </Link>
              <Link href="/auth?role=public">
                <Button variant="outline">Public Login</Button>
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
  )
}
