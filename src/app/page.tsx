import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormFlowLogo } from "@/components/ui/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <FormFlowLogo size="sm" />
            <div className="flex items-center space-x-4">
              <Link href="/builder">
                <Button variant="outline">Create Survey</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Create Beautiful Surveys
            <span className="text-blue-600"> with Ease</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
            Build professional surveys and forms with our intuitive drag-and-drop builder. Collect responses, analyze
            data, and make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/builder">
              <Button size="lg" className="w-full sm:w-auto">
                Start Building
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600">🎨</span>
                </div>
                Drag & Drop Builder
              </CardTitle>
              <CardDescription>Create surveys visually with our intuitive drag-and-drop interface</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">📊</span>
                </div>
                Real-time Analytics
              </CardTitle>
              <CardDescription>Track responses and analyze data with beautiful charts and insights</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600">🔗</span>
                </div>
                Easy Sharing
              </CardTitle>
              <CardDescription>Share your surveys via link, embed them, or export responses</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to get started?</h2>
          <Link href="/builder">
            <Button size="lg">Create Your First Survey</Button>
          </Link>
        </div>
      </main>

      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; FormFlow. Built with Next.js and React Flow.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
