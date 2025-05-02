"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface BookingChartProps {
  data: {
    month: string
    count: number
  }[]
}

export function BookingChart({ data }: BookingChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} bookings`, "Count"]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
