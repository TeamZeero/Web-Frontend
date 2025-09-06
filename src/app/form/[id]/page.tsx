"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { FormRenderer } from "@/components/form-renderer/FormRenderer"
import { Card } from "@/components/ui/card"

// Mock survey data - in a real app, this would come from a database
const mockSurvey = {
  id: "1",
  title: "Customer Feedback Survey",
  description: "Help us improve our services by sharing your feedback",
  questions: [
    {
      id: "q1",
      type: "shortAnswer",
      title: "What is your name?",
      description: "Please enter your full name",
      required: true,
    },
    {
      id: "q2",
      type: "multipleChoice",
      title: "How did you hear about us?",
      required: true,
      options: ["Social Media", "Search Engine", "Friend Referral", "Advertisement", "Other"],
    },
    {
      id: "q3",
      type: "linearScale",
      title: "How would you rate our service?",
      required: true,
      scaleMin: 1,
      scaleMax: 5,
      scaleMinLabel: "Very Poor",
      scaleMaxLabel: "Excellent",
    },
    {
      id: "q4",
      type: "checkboxes",
      title: "Which features do you use most?",
      required: false,
      options: ["Dashboard", "Reports", "Analytics", "Integrations", "Mobile App"],
    },
    {
      id: "q5",
      type: "paragraph",
      title: "Any additional feedback?",
      description: "Please share any suggestions or comments",
      required: false,
    },
  ],
}

export default function FormPage() {
  const params = useParams()
  const [survey, setSurvey] = useState(mockSurvey)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading survey data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleSubmit = async (responses: Record<string, any>) => {
    console.log("Form submitted:", responses)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
          <p className="text-gray-600 mb-6">
            Your response has been submitted successfully. We appreciate your feedback!
          </p>
          <div className="text-sm text-gray-500">You can now close this window.</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <FormRenderer survey={survey} onSubmit={handleSubmit} showProgress={true} />
    </div>
  )
}
