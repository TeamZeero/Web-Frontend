"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormFlowLogo } from "@/components/ui/logo"
import { SurveyManagement } from "@/components/survey/SurveyManagement"

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed';
  responses: number;
  completionRate: number;
  createdAt: string;
  lastModified: string;
  questions: any[];
}

export default function CreatorDashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const loadSurveys = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Load from localStorage
      const savedSurveys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("survey_")) {
          try {
            const surveyData = JSON.parse(localStorage.getItem(key) || "{}")
            savedSurveys.push({
              id: key.replace("survey_", ""),
              title: surveyData.title || "Untitled Survey",
              description: surveyData.description || "No description",
              status: surveyData.status || ("draft" as const),
              responses: surveyData.responses || 0,
              completionRate: surveyData.completionRate || 0,
              createdAt: surveyData.createdAt || new Date().toISOString().split('T')[0],
              lastModified: surveyData.lastModified || new Date().toISOString().split('T')[0],
              questions: surveyData.questions || [],
            })
          } catch (e) {
            console.error("Error parsing survey data:", e)
          }
        }
      }

      setSurveys(savedSurveys)
      setIsLoading(false)
    }
    loadSurveys()
  }, [])

  const totalSurveys = surveys.length
  const totalResponses = surveys.reduce((sum, survey) => sum + survey.responses, 0)
  const activeSurveys = surveys.filter((survey) => survey.status === "active").length
  const avgCompletionRate =
    surveys.length > 0
      ? Math.round(surveys.reduce((sum, survey) => sum + survey.completionRate, 0) / surveys.length)
      : 0

  const handleDeleteSurvey = (surveyId: string) => {
    setSurveys(surveys.filter((survey) => survey.id !== surveyId))
    localStorage.removeItem(`survey_${surveyId}`)
    
    const currentSurveyId = localStorage.getItem("currentSurveyId")
    if (currentSurveyId === `survey_${surveyId}`) {
      localStorage.removeItem("currentSurveyId")
    }
    
    alert("Survey deleted successfully!")
  }

  const handleDuplicateSurvey = (surveyId: string) => {
    const surveyToDuplicate = surveys.find((survey) => survey.id === surveyId)
    if (surveyToDuplicate) {
      const newSurvey = {
        ...surveyToDuplicate,
        id: `${Date.now()}`,
        title: `${surveyToDuplicate.title} (Copy)`,
        status: "draft" as const,
        responses: 0,
        completionRate: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
      }
      setSurveys([...surveys, newSurvey])
    }
  }

  const handleStatusChange = (surveyId: string, status: "active" | "draft" | "closed") => {
    setSurveys(
      surveys.map((survey) => (survey.id === surveyId ? { ...survey, status, lastModified: new Date().toISOString().split('T')[0] } : survey))
    )
  }

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
              <h1 className="text-xl font-semibold text-gray-800">Creator Dashboard</h1>
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
              <Link href="/builder">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  ✨ Create New Survey
                </Button>
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
                Ready to create your first survey?
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                Build beautiful, engaging surveys with our drag-and-drop builder and start collecting valuable insights
                today.
              </p>
              <Link href="/builder">
                <Button
                  size="lg"
                  className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
                >
                  ✨ Create Your First Survey
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <SurveyManagement
            surveys={surveys}
            viewMode={viewMode}
            onDelete={handleDeleteSurvey}
            onDuplicate={handleDuplicateSurvey}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  )
}
