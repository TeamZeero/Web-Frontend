"use client"

import { useState } from "react"
import type { Node } from "@xyflow/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface QuestionToolbarProps {
  onAddQuestion: (type: string) => void
  selectedNode: string | null
  nodes: Node[]
  onUpdateNode: (nodeId: string, data: any) => void
  onDeleteNode: (nodeId: string) => void
  surveyTitle: string
  surveyDescription: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
}

const questionTypes = [
  { value: "shortAnswer", label: "Short Answer", icon: "📝" },
  { value: "paragraph", label: "Paragraph", icon: "📄" },
  { value: "multipleChoice", label: "Multiple Choice", icon: "◉" },
  { value: "checkboxes", label: "Checkboxes", icon: "☑️" },
  { value: "dropdown", label: "Dropdown", icon: "📋" },
  { value: "fileUpload", label: "File Upload", icon: "📎" },
  { value: "linearScale", label: "Linear Scale", icon: "📊" },
  { value: "date", label: "Date", icon: "📅" },
  { value: "time", label: "Time", icon: "🕐" },
]

export function QuestionToolbar({
  onAddQuestion,
  selectedNode,
  nodes,
  onUpdateNode,
  onDeleteNode,
  surveyTitle,
  surveyDescription,
  onTitleChange,
  onDescriptionChange,
}: QuestionToolbarProps) {
  const [newOptionText, setNewOptionText] = useState("")

  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null
  const dataAny: any = (selectedNodeData as any) || null
  const isQuestionNode = dataAny?.type === "questionNode"

  const addOption = () => {
    if (!selectedNode || !newOptionText.trim()) return
  const currentOptions = (dataAny.data?.options as any[]) || []
    onUpdateNode(selectedNode, {
      options: [...currentOptions, newOptionText.trim()],
    })
    setNewOptionText("")
  }

  const removeOption = (index: number) => {
    if (!selectedNode) return
  const currentOptions = (dataAny.data?.options as any[]) || []
  const newOptions = currentOptions.filter((_: any, i: number) => i !== index)
    onUpdateNode(selectedNode, { options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    if (!selectedNode) return
  const currentOptions = [...((dataAny.data?.options as any[]) || [])]
    currentOptions[index] = value
    onUpdateNode(selectedNode, { options: currentOptions })
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Survey Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Survey Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="survey-title">Title</Label>
              <Input
                id="survey-title"
                value={surveyTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Survey title"
              />
            </div>
            <div>
              <Label htmlFor="survey-description">Description</Label>
              <Textarea
                id="survey-description"
                value={surveyDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Survey description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Question Editor */}
        {isQuestionNode && selectedNodeData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Edit Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question-title">Question Title</Label>
                <Input
                  id="question-title"
                  value={dataAny.data?.title || ""}
                  onChange={(e) => onUpdateNode(selectedNode!, { title: e.target.value })}
                  placeholder="Enter question title"
                />
              </div>

              <div>
                <Label htmlFor="question-description">Description</Label>
                <Textarea
                  id="question-description"
                  value={dataAny.data?.description || ""}
                  onChange={(e) => onUpdateNode(selectedNode!, { description: e.target.value })}
                  placeholder="Optional description"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={dataAny.data?.required || false}
                  onChange={(e) => onUpdateNode(selectedNode!, { required: e.target.checked })}
                />
                <Label htmlFor="required">Required</Label>
              </div>

              {/* Options for multiple choice, checkboxes, dropdown */}
              {["multipleChoice", "checkboxes", "dropdown"].includes(dataAny.data?.questionType) && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2 mt-2">
                    {(dataAny.data?.options || []).map((option: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          size={16}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-red-600"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newOptionText}
                        onChange={(e) => setNewOptionText(e.target.value)}
                        placeholder="New option"
                        size={16}
                        onKeyPress={(e) => e.key === "Enter" && addOption()}
                      />
                      <Button variant="outline" size="sm" onClick={addOption}>
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <Button variant="destructive" size="sm" onClick={() => onDeleteNode(selectedNode!)} className="w-full">
                Delete Question
              </Button>
            </CardContent>
          </Card>
        )}

        {selectedNode && !isQuestionNode && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 text-center">Select a question node to edit its properties</p>
            </CardContent>
          </Card>
        )}

        {/* Add Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {questionTypes.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddQuestion(type.value)}
                  draggable
                  onDragStart={(e) => {
                    try {
                      e.dataTransfer.setData("application/question-type", type.value)
                      e.dataTransfer.effectAllowed = "copy"
                    } catch (err) {
                      e.dataTransfer.setData("text/plain", type.value)
                    }
                  }}
                  className="justify-start"
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
