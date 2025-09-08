"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormFlowLogo } from "@/components/ui/logo"
import { SurveyManagement } from "@/components/survey/SurveyManagement"

interface Survey {
  id: string
  title: string
  description: string
  status: 'draft' | 'active' | 'closed'
  responses: number
  completionRate: number
  createdAt: string
  lastModified: string
  questions: any[]
  category?: string
  estimatedTime?: string
}

export default function PublicDashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data for public surveys
        const mockSurveys: Survey[] = [
          {
            id: "1",
            title: "Community Feedback Survey",
            description: "Help us improve our services by sharing your valuable feedback about local community services.",
            status: "active",
            responses: 1245,
            completionRate: 62,
            createdAt: "2023-05-15",
            lastModified: "2023-05-15",
            questions: [],
            category: "Community",
            estimatedTime: "5 min"
          },
          {
            id: "2",
            title: "Product Feedback",
            description: "Tell us what you think about our latest product.",
            status: "active",
            responses: 87,
            completionRate: 43,
            createdAt: "2023-05-10",
            lastModified: "2023-05-10",
            questions: [],
            category: "Product"
          },
          {
            id: "3",
            title: "Website Usability Study",
            description: "Help us improve our website experience.",
            status: "active",
            responses: 45,
            completionRate: 22,
            createdAt: "2023-05-01",
            lastModified: "2023-05-01",
            questions: [],
            category: "UX"
          },
        ]

        setSurveys(mockSurveys)
      } catch (error) {
        console.error("Failed to load surveys:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSurveys()
  }, [])
  const totalSurveys = surveys.length
  const totalResponses = surveys.reduce((sum: number, survey: Survey) => sum + survey.responses, 0)
  const activeSurveys = surveys.filter((survey: Survey) => survey.status === "active").length
  const avgCompletionRate =
    surveys.length > 0
      ? Math.round(surveys.reduce((sum: number, survey: Survey) => sum + survey.completionRate, 0) / surveys.length)
      : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <FormFlowLogo size="sm" />
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-800">Public Surveys</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  ⊞ Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  ☰ List
                </Button>
              </div>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                {isLoading ? "..." : totalSurveys}
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </CardTitle>
              <CardDescription className="font-medium">Total Surveys</CardDescription>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                {isLoading ? "..." : totalResponses}
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </CardTitle>
              <CardDescription className="font-medium">Total Responses</CardDescription>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                {isLoading ? "..." : `${avgCompletionRate}%`}
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              </CardTitle>
              <CardDescription className="font-medium">Avg Completion Rate</CardDescription>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                {isLoading ? "..." : activeSurveys}
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </CardTitle>
              <CardDescription className="font-medium">Active Surveys</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {!isLoading && surveys.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                No surveys available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                There are currently no public surveys available. Please check back later.
              </p>
            </div>
          </Card>
        ) : (
          <SurveyManagement
            surveys={surveys}
            viewMode={viewMode}
            onDelete={() => {}}
            onDuplicate={() => {}}
            onStatusChange={() => {}}
          />
        )}
      </main>
    </div>
  )
}
