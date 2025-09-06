"use client"

import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuestionRenderer } from "./QuestionRenderer"

interface Question {
  id: string
  type: string
  title: string
  description?: string
  required: boolean
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
}

interface Survey {
  id: string
  title: string
  description?: string
  questions: Question[]
}

interface FormRendererProps {
  survey: Survey
  onSubmit: (responses: Record<string, any>) => void
  showProgress?: boolean
}

export function FormRenderer({ survey, onSubmit, showProgress = true }: FormRendererProps) {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [showAllQuestions, setShowAllQuestions] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const progress = (Object.keys(responses).length / survey.questions.length) * 100

  const updateResponse = useCallback(
    (questionId: string, value: any) => {
      setResponses((prev) => ({ ...prev, [questionId]: value }))
      if (errors[questionId]) {
        setErrors((prev) => ({ ...prev, [questionId]: "" }))
      }
    },
    [errors],
  )

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}

    survey.questions.forEach((question) => {
      if (question.required) {
        const response = responses[question.id]
        if (
          !response ||
          (Array.isArray(response) && response.length === 0) ||
          (typeof response === "string" && response.trim() === "")
        ) {
          newErrors[question.id] = "This question is required"
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstErrorElement = document.querySelector('[data-error="true"]')
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setIsSubmitting(true)
    try {
      const submissionData = {
        surveyId: survey.id,
        responses: responses,
        submittedAt: new Date().toISOString(),
        completionTime: Math.round(performance.now() / 1000),
        userAgent: navigator.userAgent,
      }

      const responseId = `response_${Date.now()}`
      localStorage.setItem(responseId, JSON.stringify(submissionData))

      const surveyData = localStorage.getItem(survey.id)
      if (surveyData) {
        const parsedSurvey = JSON.parse(surveyData)
        parsedSurvey.responses = (parsedSurvey.responses || 0) + 1
        parsedSurvey.completionRate = Math.min(100, (parsedSurvey.responses / 100) * 100)
        localStorage.setItem(survey.id, JSON.stringify(parsedSurvey))
      }

      await onSubmit(submissionData)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Failed to submit form:", error)
      alert("Failed to submit survey. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-green-800">Thank You!</h1>
            <p className="text-gray-600">Your response has been submitted successfully.</p>
            <Button variant="outline" onClick={() => (window.location.href = "/")} className="mt-4">
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {Object.keys(responses).length} of {survey.questions.length} questions answered
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <Card className="p-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
            {survey.description && <p className="text-gray-600 text-lg">{survey.description}</p>}
          </div>

          <div className="space-y-8">
            {survey.questions.map((question, index) => (
              <div
                key={question.id}
                className="space-y-4 pb-6 border-b border-gray-100 last:border-b-0"
                data-error={errors[question.id] ? "true" : "false"}
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {index + 1}. {question.title}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h2>
                  {question.description && <p className="text-gray-600 mb-4">{question.description}</p>}
                </div>

                <QuestionRenderer
                  question={question}
                  value={responses[question.id]}
                  onChange={(value) => updateResponse(question.id, value)}
                  error={errors[question.id]}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-6 border-t">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || survey.questions.length === 0}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
