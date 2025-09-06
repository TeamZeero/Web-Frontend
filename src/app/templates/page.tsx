import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      title: "Customer Feedback Survey",
      description: "Collect valuable feedback from your customers",
      category: "Feedback",
      questions: 8,
    },
    {
      id: 2,
      title: "Employee Satisfaction Survey",
      description: "Measure employee engagement and satisfaction",
      category: "HR",
      questions: 12,
    },
    {
      id: 3,
      title: "Event Registration Form",
      description: "Collect registrations for events and workshops",
      category: "Events",
      questions: 6,
    },
    {
      id: 4,
      title: "Product Research Survey",
      description: "Gather insights for product development",
      category: "Research",
      questions: 10,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">← Home</Button>
              </Link>
              <h1 className="text-xl font-semibold">Survey Templates</h1>
            </div>
            <Link href="/builder">
              <Button>Start from Scratch</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
          <p className="text-gray-600">Start with a pre-built template and customize it to your needs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{template.category}</span>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{template.questions} questions</span>
                  <Link href="/builder">
                    <Button size="sm">Use Template</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
