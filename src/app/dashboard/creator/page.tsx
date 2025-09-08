import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreatorDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-[#0b57d0]" />
            <span className="font-semibold">Admin · Creator Portal</span>
          </div>
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="flex flex-wrap gap-3">
          <Link href="/builder">
            <Button className="bg-[#0b57d0] hover:bg-[#0a4ec0]">Create New Survey</Button>
          </Link>
          <Link href="/templates">
            <Button variant="outline">Browse Templates</Button>
          </Link>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Surveys</CardTitle>
              <CardDescription>Manage drafts, active and closed surveys</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use the Builder to design surveys, then deploy to channels.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quality</CardTitle>
              <CardDescription>Validation, translations, and auto‑coding</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              AI helps ensure data fidelity across languages and media types.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monitoring</CardTitle>
              <CardDescription>Track field progress and reliability</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              View live dashboards, download reports, and course‑correct faster.
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}


