"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponseChart } from "@/components/analytics/ResponseChart"
import { ResponseTable } from "@/components/analytics/ResponseTable"
import { Badge } from "@/components/ui/badge"

// Mock data - in a real app, this would come from a database
const mockSurveyData = {
  id: "1",
  title: "Customer Feedback Survey",
  description: "Help us improve our services",
  status: "active",
  createdAt: "2024-01-15",
  totalResponses: 156,
  completionRate: 89,
  questions: [
    { id: "q1", title: "What is your name?", type: "shortAnswer" },
    { id: "q2", title: "How did you hear about us?", type: "multipleChoice" },
    { id: "q3", title: "Rate our service", type: "linearScale" },
    { id: "q4", title: "Which features do you use?", type: "checkboxes" },
    { id: "q5", title: "Additional feedback", type: "paragraph" },
  ],
  responses: Array.from({ length: 156 }, (_, i) => ({
    id: `response-${i + 1}`,
    submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    responses: {
      q1: `User ${i + 1}`,
      q2: ["Social Media", "Search Engine", "Friend Referral"][Math.floor(Math.random() * 3)],
      q3: Math.floor(Math.random() * 5) + 1,
      q4: ["Dashboard", "Reports", "Analytics"].slice(0, Math.floor(Math.random() * 3) + 1),
      q5: i % 3 === 0 ? "Great service, keep it up!" : i % 3 === 1 ? "Could be improved" : "",
    },
  })),
}

export default function ResponsesPage() {
  const params = useParams()
  const [survey, setSurvey] = useState(mockSurveyData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading survey data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.surveyId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey responses...</p>
        </Card>
      </div>
    )
  }

  // Generate analytics data
  const hearAboutUsData = survey.responses.reduce((acc: Record<string, number>, response) => {
    const answer = response.responses.q2
    acc[answer] = (acc[answer] || 0) + 1
    return acc
  }, {})

  const ratingData = survey.responses.reduce((acc: Record<string, number>, response) => {
    const rating = response.responses.q3
    acc[`${rating} Star${rating !== 1 ? "s" : ""}`] = (acc[`${rating} Star${rating !== 1 ? "s" : ""}`] || 0) + 1
    return acc
  }, {})

  const hearAboutChartData = Object.entries(hearAboutUsData).map(([label, value]) => ({
    label,
    value,
    percentage: Math.round((value / survey.totalResponses) * 100),
  }))

  const ratingChartData = Object.entries(ratingData).map(([label, value]) => ({
    label,
    value,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">← Dashboard</Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{survey.title}</h1>
                <p className="text-sm text-gray-600">Survey Responses & Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={survey.status === "active" ? "default" : "secondary"}>{survey.status}</Badge>
              <Button variant="outline">Export Data</Button>
              <Button variant="outline">Share Results</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{survey.totalResponses}</CardTitle>
              <CardDescription>Total Responses</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{survey.completionRate}%</CardTitle>
              <CardDescription>Completion Rate</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {Math.round(
                  (survey.responses.reduce((acc, r) => acc + (r.responses.q3 || 0), 0) / survey.responses.length) * 10,
                ) / 10}
              </CardTitle>
              <CardDescription>Average Rating</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{new Date(survey.createdAt).toLocaleDateString()}</CardTitle>
              <CardDescription>Created Date</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ResponseChart
            title="How did you hear about us?"
            description="Distribution of referral sources"
            data={hearAboutChartData}
            type="pie"
          />
          <ResponseChart
            title="Service Ratings"
            description="Distribution of service ratings"
            data={ratingChartData}
            type="bar"
          />
        </div>

        {/* Response Table */}
        <ResponseTable responses={survey.responses} questions={survey.questions} />
      </main>
    </div>
  )
}
