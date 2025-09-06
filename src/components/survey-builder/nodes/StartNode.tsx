"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card } from "@/components/ui/card"

export const StartNode = memo(({ data }: NodeProps) => {
  return (
    <Card className="min-w-[120px] p-4 bg-green-50 border-green-200">
      <div className="text-center">
        <div className="text-2xl mb-1">🚀</div>
        <div className="text-sm font-semibold text-green-800">Start</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  )
})

StartNode.displayName = "StartNode"
