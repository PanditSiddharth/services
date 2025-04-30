// app/admin/services/page.tsx
import Link from "next/link"
import { getServices } from "@/app/actions/services"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DeleteServiceButton } from "./components/delete-service-button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons" // You'll need to create this component

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <Link href="/admin/services/new">
          <Button>Add New Service</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No services found. Create your first service to get started.
          </p>
        ) : (
          services.map((service: any) => (
            <Card key={service._id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {/* Render icon dynamically based on service.icon */}
                    <div className="bg-primary/10 p-2 rounded-md">
                      {Icons[service.icon as "Wrench"] ? (
                        Icons[service.icon as "Wrench"]({ className: "h-5 w-5" })
                      ) : (
                        <Icons.Wrench className="h-5 w-5" />
                      )}
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                  </div>
                  <Badge variant={service.isActive ? "default" : "outline"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {service.subServices.length} Sub-services
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/services/${service._id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                    <DeleteServiceButton id={service._id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}