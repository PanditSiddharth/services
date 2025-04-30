// app/admin/dashboard/components/service-stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface ServiceStatsCardsProps {
  totalServices: number
  activeServices: number
  totalSubServices: number
}

export function ServiceStatsCards({
  totalServices,
  activeServices,
  totalSubServices,
}: ServiceStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          <Icons.Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServices}</div>
          <p className="text-xs text-muted-foreground">
            All services in the system
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Services</CardTitle>
          <Icons.Check className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeServices}</div>
          <p className="text-xs text-muted-foreground">
            Services visible to customers ({Math.round((activeServices / totalServices) * 100) || 0}%)
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Sub-Services</CardTitle>
          <Icons.Garden className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubServices}</div>
          <p className="text-xs text-muted-foreground">
            Total sub-services across all services
          </p>
        </CardContent>
      </Card>
    </div>
  )
}