import type { NodeProps } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handle, Position } from "@xyflow/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LogicNodeData {
  condition?: string;
  target?: string;
  type: "conditional" | "loop";
}

export function LogicNode({ data }: NodeProps<LogicNodeData>) {
  return (
    <Card className="w-64 shadow-md border-purple-300 bg-purple-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
        <CardTitle className="text-sm font-medium text-purple-700">
          Logic: {data.type === "conditional" ? "Conditional" : "Loop"}
        </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-purple-600"
        >
          {data.type === "conditional" ? (
            <path d="M7.5 7.5L16.5 16.5M16.5 7.5L7.5 16.5" />
          ) : (
            <path d="m12 19-7-7 7-7" />
          )}
        </svg>
      </CardHeader>
      <CardContent className="p-3 pt-1 text-xs text-purple-800">
        {data.type === "conditional" ? (
          <div>
            <p className="mb-1">IF condition IS TRUE, THEN:</p>
            <Input
              placeholder="e.g., question1 == 'Yes'"
              value={data.condition}
              className="nodrag px-2 py-1 text-xs"
            />
            <p className="mt-2 mb-1">GOTO Question:</p>
            <Input
              placeholder="e.g., question3"
              value={data.target}
              className="nodrag px-2 py-1 text-xs"
            />
          </div>
        ) : (
          <div>
            <p className="mb-1">Loop through:</p>
            <Input
              placeholder="e.g., items in question2"
              className="nodrag px-2 py-1 text-xs"
            />
            <p className="mt-2 mb-1">Max Iterations:</p>
            <Input
              placeholder="e.g., 5"
              type="number"
              className="nodrag px-2 py-1 text-xs"
            />
          </div>
        )}
      </CardContent>
      <Handle type="target" position={Position.Top} id="in" />
      <Handle type="source" position={Position.Bottom} id="out" />
    </Card>
  );
}
