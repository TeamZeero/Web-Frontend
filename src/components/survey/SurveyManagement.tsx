"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

interface Survey {
  id: string
  title: string
  description: string
  status: "active" | "draft" | "closed"
  responses: number
  completionRate: number
  createdAt: string
  lastModified: string
}

interface SurveyManagementProps {
  surveys: Survey[]
  onDelete: (surveyId: string) => void
  onDuplicate: (surveyId: string) => void
  onStatusChange: (surveyId: string, status: Survey["status"]) => void
}

export function SurveyManagement({ surveys, onDelete, onDuplicate, onStatusChange }: SurveyManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Survey["status"]>("all")
  const [sortBy, setSortBy] = useState<"title" | "created" | "responses">("created")
  const [shareDialogOpen, setShareDialogOpen] = useState<string | null>(null)
  const [copiedSurvey, setCopiedSurvey] = useState<string | null>(null)

  const handleShare = useCallback(async (surveyId: string) => {
    const shareUrl = `${window.location.origin}/form/${surveyId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedSurvey(surveyId)
      setTimeout(() => setCopiedSurvey(null), 3000)
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiedSurvey(surveyId)
      setTimeout(() => setCopiedSurvey(null), 3000)
    }
  }, [])

  const handleEmbedCode = useCallback(async (surveyId: string) => {
    const embedCode = `<iframe src="${window.location.origin}/form/${surveyId}" width="100%" height="600" frameborder="0" style="border: 1px solid #e5e7eb; border-radius: 8px;"></iframe>`
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopiedSurvey(surveyId)
      setTimeout(() => setCopiedSurvey(null), 3000)
      alert("Embed code copied to clipboard!")
    } catch (error) {
      alert(`Embed code: ${embedCode}`)
    }
  }, [])

  const handleExport = useCallback(
    (surveyId: string, format: "csv" | "json" | "pdf") => {
      const survey = surveys.find((s) => s.id === surveyId)
      if (!survey) return

      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `${survey.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${timestamp}`

      if (format === "json") {
        const dataStr = JSON.stringify(survey, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${filename}.json`
        link.click()
        URL.revokeObjectURL(url)
      } else if (format === "csv") {
        // Generate CSV with survey responses (mock data for demo)
        const csvContent = [
          ["Response ID", "Submitted At", "Question 1", "Question 2", "Question 3"],
          ["resp_001", "2025-01-15", "Answer 1", "Answer 2", "Answer 3"],
          ["resp_002", "2025-01-16", "Answer A", "Answer B", "Answer C"],
        ]
          .map((row) => row.join(","))
          .join("\n")

        const dataBlob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${filename}.csv`
        link.click()
        URL.revokeObjectURL(url)
      } else if (format === "pdf") {
        // For PDF, we'll show a message since it requires a PDF library
        alert(
          "PDF export functionality requires a PDF generation library. This feature will be available in a future update.",
        )
      }
    },
    [surveys],
  )

  const filteredSurveys = surveys
    .filter((survey) => {
      const matchesSearch =
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || survey.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "responses":
          return b.responses - a.responses
        case "created":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const getStatusColor = (status: Survey["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "closed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Management</CardTitle>
        <CardDescription>Manage all your surveys in one place</CardDescription>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search surveys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="created">Sort by Created</option>
              <option value="title">Sort by Title</option>
              <option value="responses">Sort by Responses</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredSurveys.length > 0 ? (
          <div className="space-y-4">
            {filteredSurveys.map((survey) => (
              <div key={survey.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{survey.title}</h3>
                    <Badge variant={getStatusColor(survey.status)}>{survey.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{survey.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{survey.responses} responses</span>
                    <span>{survey.completionRate}% completion</span>
                    <span>Modified {new Date(survey.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link href={`/responses/${survey.id}`}>
                    <Button variant="outline" size="sm">
                      📊 Analytics
                    </Button>
                  </Link>

                  <Link href={`/form/${survey.id}`}>
                    <Button variant="outline" size="sm">
                      👁️ Preview
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(survey.id)}
                    className={copiedSurvey === survey.id ? "bg-green-50 border-green-200 text-green-700" : ""}
                  >
                    {copiedSurvey === survey.id ? "✅ Copied!" : "🔗 Share"}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        ⚙️ More
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onDuplicate(survey.id)}>📋 Duplicate Survey</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEmbedCode(survey.id)}>🔗 Copy Embed Code</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(survey.id, "active")}>
                        ✅ Mark as Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(survey.id, "closed")}>
                        🔒 Close Survey
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(survey.id, "csv")}>
                        📊 Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(survey.id, "json")}>
                        📄 Export as JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(survey.id, "pdf")}>
                        📑 Export as PDF
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 focus:text-red-600"
                          >
                            🗑️ Delete Survey
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Survey</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{survey.title}"? This action cannot be undone and will
                              permanently remove all survey data and responses.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                onDelete(survey.id)
                                localStorage.removeItem(`survey_${survey.id}`)
                                const currentSurveyId = localStorage.getItem("currentSurveyId")
                                if (currentSurveyId === `survey_${survey.id}`) {
                                  localStorage.removeItem("currentSurveyId")
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" ? "No surveys match your filters" : "No surveys created yet"}
            </p>
            <Link href="/builder">
              <Button>Create Your First Survey</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
