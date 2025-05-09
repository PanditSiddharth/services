"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface RevenueChartProps {
  data: {
    name: string
    total: number
  }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis stroke="#888888" 
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip 
          formatter={(value: number) => [`₹${value}`, "Revenue"]}
        />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="#2563eb" 
          strokeWidth={2} 
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
