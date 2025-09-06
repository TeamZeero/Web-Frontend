"use client"

import { FormRenderer } from "./FormRenderer"

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
  title: string
  description?: string
  questions: Question[]
}

interface FormPreviewProps {
  survey: Survey
}

export function FormPreview({ survey }: FormPreviewProps) {
  const handlePreviewSubmit = (responses: Record<string, any>) => {
    console.log("Preview submission:", responses)
    alert("This is a preview. Responses are not saved.")
  }

  if (!survey.questions || survey.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Preview Mode - Responses will not be saved
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Added Yet</h3>
            <p className="text-gray-600 mb-6">
              Add questions to your survey using the Flow View or List View to see them in the preview.
            </p>
            <div className="text-sm text-gray-500">Switch to Flow View or List View to start building your survey</div>
          </div>
        </div>
      </div>
    )
  }

  // Convert survey data to the format expected by FormRenderer
  const formattedSurvey = {
    id: "preview",
    title: survey.title || "Untitled Survey",
    description: survey.description,
    questions: survey.questions,
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mb-4 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          Preview Mode - Responses will not be saved
        </div>
      </div>
      <FormRenderer survey={formattedSurvey} onSubmit={handlePreviewSubmit} showProgress={true} />
    </div>
  )
}
