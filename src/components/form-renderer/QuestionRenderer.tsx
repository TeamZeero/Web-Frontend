"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface QuestionRendererProps {
  question: Question
  value: any
  onChange: (value: any) => void
  error?: string
}

export function QuestionRenderer({ question, value, onChange, error }: QuestionRendererProps) {
  const renderQuestionInput = () => {
    switch (question.type) {
      case "shortAnswer":
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your answer"
            className={error ? "border-red-500" : ""}
          />
        )

      case "paragraph":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your answer"
            rows={4}
            className={error ? "border-red-500" : ""}
          />
        )

      case "multipleChoice":
        return (
          <RadioGroup value={value || ""} onValueChange={onChange} className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkboxes":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || []
                    if (checked) {
                      onChange([...currentValues, option])
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option))
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "dropdown":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "linearScale":
        const min = question.scaleMin || 1
        const max = question.scaleMax || 5
        const scaleOptions = Array.from({ length: max - min + 1 }, (_, i) => min + i)

        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{question.scaleMinLabel || min}</span>
              <span>{question.scaleMaxLabel || max}</span>
            </div>
            <RadioGroup
              value={value?.toString() || ""}
              onValueChange={(val) => onChange(Number.parseInt(val))}
              className="flex justify-between"
            >
              {scaleOptions.map((num) => (
                <div key={num} className="flex flex-col items-center space-y-2">
                  <RadioGroupItem value={num.toString()} id={`${question.id}-${num}`} />
                  <Label htmlFor={`${question.id}-${num}`} className="text-sm">
                    {num}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "time":
        return (
          <Input
            type="time"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "fileUpload":
        return (
          <div className="space-y-2">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                onChange(file ? file.name : "")
              }}
              className={error ? "border-red-500" : ""}
            />
            {value && <p className="text-sm text-gray-600">Selected: {value}</p>}
          </div>
        )

      default:
        return (
          <div className="p-4 bg-gray-100 rounded-md text-center text-gray-600">
            Question type "{question.type}" not supported
          </div>
        )
    }
  }

  return (
    <div className="space-y-2">
      {renderQuestionInput()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
