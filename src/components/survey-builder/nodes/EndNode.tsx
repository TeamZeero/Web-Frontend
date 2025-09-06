"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card } from "@/components/ui/card"

export const EndNode = memo(({ data }: NodeProps) => {
  return (
    <Card className="min-w-[120px] p-4 bg-blue-50 border-blue-200">
      <Handle type="target" position={Position.Top} />
      <div className="text-center">
        <div className="text-2xl mb-1">🎯</div>
        <div className="text-sm font-semibold text-blue-800">Submit</div>
      </div>
    </Card>
  )
})

EndNode.displayName = "EndNode"
