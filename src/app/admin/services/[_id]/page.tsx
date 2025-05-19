// app/admin/services/[id]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { getServiceById } from "@/app/actions/services"
import { ServiceForm } from "../components/service-form"
import { SubServiceList } from "../components/sub-service-list"
import { SubServiceForm } from "../components/sub-service-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ServiceDetailsPage({
  params,
}: any) {
  const service = await getServiceById(params._id)
  
  if (!service) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Service</h1>
        <Link href="/admin/services">
          <Button variant="outline">Back to Services</Button>
        </Link>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Service Details</TabsTrigger>
          <TabsTrigger value="subservices">Sub-Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Edit Service</CardTitle>
              <CardDescription>
                Update the service details and settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceForm service={service} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subservices">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sub-Services</CardTitle>
                <CardDescription>
                  Manage the sub-services associated with this service.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubServiceList 
                  serviceId={service._id} 
                  subServices={service.subServices} 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Add Sub-Service</CardTitle>
              </CardHeader>
              <CardContent>
                <SubServiceForm serviceId={service._id} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}