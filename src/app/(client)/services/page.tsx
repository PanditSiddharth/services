// app/(client)/services/page.tsx
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getServices } from "@/app/actions/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons" // You'll need to create this component

export const metadata: Metadata = {
  title: "Services | Your Company",
  description: "Explore our wide range of professional services",
}

export default async function ServicesPage() {
  const services = await getServices()
  const activeServices = services.filter((service:any) => service.isActive)

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our comprehensive range of professional services designed to meet your needs.
        </p>
      </div>

      {activeServices.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No services available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {activeServices.map((service:any) => (
            <Card key={service._id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-1/3 h-48 md:h-full min-h-[200px]">
                  <Image
                    src={service.image || "/service.jpg"}
                    alt={service.name}
                    fill
                    className="object-cover rounded-full mx-2"
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-primary/10 p-2 rounded-md">
                      {Icons[(service.icon || "Wrench") as keyof typeof Icons] ? (
                        Icons[(service.icon || "Wrench") as keyof typeof Icons]({ className: "h-5 w-5" })
                      ) : (
                        <Icons.Wrench className="h-5 w-5" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold">{service.name}</h3>
                  </div>

                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Icons.CheckCircle className="h-4 w-4 text-green-500" />
                      {service.subServices?.length || 0} service options available
                    </p>
                    {service.duration && (
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Icons.Clock className="h-4 w-4 text-blue-500" />
                        Average duration: {service.duration}
                      </p>
                    )}
                    {service.startingPrice && (
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Icons.IndianRupee className="h-4 w-4 text-yellow-500" />
                        Starting from: ₹{service.startingPrice}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/services/${service.slug}`}>View Details</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href={`/providers?service=${service._id}`}>
                        Find Providers
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}