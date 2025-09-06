"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Response {
  id: string
  submittedAt: string
  responses: Record<string, any>
  completionTime?: number
}

interface ResponseTableProps {
  responses: Response[]
  questions: Array<{ id: string; title: string; type: string }>
}

export function ResponseTable({ responses, questions }: ResponseTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredResponses = responses.filter((response) =>
    Object.values(response.responses).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const paginatedResponses = filteredResponses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage)

  const formatValue = (value: any, questionType: string) => {
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    if (questionType === "date") {
      return new Date(value).toLocaleDateString()
    }
    if (questionType === "time") {
      return value
    }
    return String(value || "No answer")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Responses</CardTitle>
        <CardDescription>View and analyze individual survey responses</CardDescription>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Badge variant="secondary">{filteredResponses.length} responses</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Submitted</th>
                {questions.map((question) => (
                  <th key={question.id} className="text-left p-2 font-medium min-w-[150px]">
                    {question.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedResponses.map((response) => (
                <tr key={response.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-sm text-gray-600">{new Date(response.submittedAt).toLocaleDateString()}</td>
                  {questions.map((question) => (
                    <td key={question.id} className="p-2 text-sm">
                      <div className="max-w-[200px] truncate">
                        {formatValue(response.responses[question.id], question.type)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredResponses.length)} of {filteredResponses.length} responses
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
