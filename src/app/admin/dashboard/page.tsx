// app/admin/dashboard/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getServices } from "@/app/actions/services"
import { ServiceChart } from "./components/service-chart"
import { ServiceStatsCards } from "./components/service-stats-cards"
import { RecentServices } from "./components/recent-services"

export default async function DashboardPage() {
  const services = await getServices()
  
  // Calculate statistics
  const totalServices = services.length
  const activeServices = services.filter((service: any) => service.isActive).length
  const totalSubServices = services.reduce(
    (total:any, service:any) => total + service.subServices.length, 
    0
  )
  
  // Get the 5 most recent services
  const recentServices = services
    .sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <ServiceStatsCards 
        totalServices={totalServices}
        activeServices={activeServices}
        totalSubServices={totalSubServices}
      />
      
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>
              Breakdown of services and their sub-services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServiceChart services={services} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
            <CardDescription>
              Recently added services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentServices services={recentServices} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
