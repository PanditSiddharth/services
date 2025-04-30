// app/admin/dashboard/components/service-chart.tsx
"use client"

import { Card } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  CartesianGrid 
} from "recharts"

interface Service {
  _id: string
  name: string
  subServices: any[]
}

export function ServiceChart({ services }: { services: Service[] }) {
  // Prepare data for the chart
  const data = services.map(service => ({
    name: service.name,
    subServices: service.subServices.length,
  }))

  if (services.length === 0) {
    return (
      <Card className="flex items-center justify-center p-6 h-64">
        <p className="text-muted-foreground">No service data available</p>
      </Card>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="subServices" fill="#8884d8" name="Sub-Services" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
