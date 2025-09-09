"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card } from "@/components/ui/card"

interface QuestionNodeData {
  questionType: string
  title: string
  description: string
  required: boolean
  options?: string[]
  conditionalTarget?: string
  conditionalCondition?: string
}

export const QuestionNode = memo((props: any) => {
  const { data, selected, id } = props
  const getQuestionIcon = (type: string) => {
    const icons: Record<string, string> = {
      shortAnswer: "📝",
      paragraph: "📄",
      multipleChoice: "◉",
      checkboxes: "☑️",
      dropdown: "📋",
      fileUpload: "📎",
      linearScale: "📊",
      date: "📅",
      time: "🕐",
    }
    return icons[type] || "❓"
  }

  return (
    <Card
      onMouseDown={() => {
        // dispatch a small global event so the wrapper can reliably select
        // this node even if some pointer layers intercept clicks
        try {
          window.dispatchEvent(new CustomEvent("flow-node-mousedown", { detail: { id } }));
        } catch (e) {}
      }}
      className={`min-w-[200px] p-4 ${selected ? "ring-2 ring-blue-500" : ""}`}>
      <Handle type="target" position={Position.Top} />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getQuestionIcon(data.questionType)}</span>
          <span className="text-sm font-medium capitalize">
            {data.questionType.replace(/([A-Z])/g, " $1").trim()}
          </span>
          {data.required && <span className="text-red-500 text-xs">*</span>}
        </div>

        <div className="text-sm font-semibold text-gray-900 line-clamp-2">
          {data.title}
        </div>

        {data.description && (
          <div className="text-xs text-gray-600 line-clamp-1">
            {data.description}
          </div>
        )}

        {data.options && data.options.length > 0 && (
          <div className="text-xs text-gray-500">
            {data.options.length} option{data.options.length !== 1 ? "s" : ""}
          </div>
        )}

        {data.conditionalTarget && (
          <div className="text-xs text-purple-600 border-t pt-2 mt-2">
            If: {data.conditionalCondition || "[No Condition]"} &gt; Go to: {data.conditionalTarget}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </Card>
  )
})

QuestionNode.displayName = "QuestionNode"
