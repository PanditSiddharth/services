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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activeServices.map((service:any) => (
            <Card key={service._id || service.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative w-full h-48">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    {Icons[(service.icon || "Wrench") as keyof typeof Icons] ? (
                      Icons[(service.icon || "Wrench") as keyof typeof Icons]({ className: "h-5 w-5" })
                    ) : (
                      <Icons.Wrench className="h-5 w-5" />
                    )}
                  </div>
                  <CardTitle>{service.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="line-clamp-3">
                  {service.description}
                </CardDescription>
                <div className="mt-4">
                  <p className="text-sm font-medium">
                    {service.subServices?.length || 0} service options available
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="w-1/2">
                  <Link href={`/services/${service.slug}`}>
                    View Details
                  </Link>
                </Button>
                <Button asChild className="w-1/2">
                  <Link 
                    href={`/providers?service=${service._id}`}
                    className="flex items-center justify-center"
                  >
                    Find Providers
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}