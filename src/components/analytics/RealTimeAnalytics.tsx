"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RealTimeData {
  activeResponders: number
  completionRate: number
  avgTimeSpent: number
  recentResponses: Array<{
    id: string
    timestamp: Date
    progress: number
  }>
}

interface RealTimeAnalyticsProps {
  surveyId: string
}

export function RealTimeAnalytics({ surveyId }: RealTimeAnalyticsProps) {
  const [data, setData] = useState<RealTimeData>({
    activeResponders: 0,
    completionRate: 0,
    avgTimeSpent: 0,
    recentResponses: [],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        activeResponders: Math.floor(Math.random() * 10) + 1,
        completionRate: Math.floor(Math.random() * 100),
        avgTimeSpent: Math.floor(Math.random() * 300) + 60,
        recentResponses: Array.from({ length: 5 }, (_, i) => ({
          id: `response-${Date.now()}-${i}`,
          timestamp: new Date(Date.now() - Math.random() * 300000),
          progress: Math.floor(Math.random() * 100),
        })),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [surveyId])

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            Live Responders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeResponders}</div>
          <p className="text-sm text-gray-600">Currently taking survey</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.completionRate}%</div>
          <p className="text-sm text-gray-600">Average completion</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Avg Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.floor(data.avgTimeSpent / 60)}m {data.avgTimeSpent % 60}s
          </div>
          <p className="text-sm text-gray-600">Time to complete</p>
        </CardContent>
      </Card>
    </div>
  )
}
