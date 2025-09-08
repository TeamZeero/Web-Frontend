import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PublicDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-[#0b57d0]" />
            <span className="font-semibold">Citizen Portal</span>
          </div>
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Open Surveys</CardTitle>
              <CardDescription>Participate in ongoing public surveys</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              View available surveys and submit responses in your preferred language.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>My Submissions</CardTitle>
              <CardDescription>Review your recently submitted responses</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Track submission status and download acknowledgements if available.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Help & Accessibility</CardTitle>
              <CardDescription>Guides, languages, and support</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Learn about voice/WhatsApp options and accessibility features.
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}


