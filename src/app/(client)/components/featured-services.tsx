// app/(client)/components/featured-services.tsx
import Link from "next/link"
import Image from "next/image"
import { getServices } from "@/app/actions/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export async function FeaturedServices() {
  const services = await getServices()
  const featuredServices = services
    .filter((service:any) => service.isActive)
    // Limit to 3 services
    .slice(0, 3)

  if (featuredServices.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our range of professional services designed to meet your needs
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service: any) => (
            <Card key={service._id} className="overflow-hidden flex flex-col h-full">
              <div className="relative w-full h-40">
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
                    {Icons[(service as any).icon as "Wrench"] ? (
                      Icons[(service as any).icon as "Wrench"]({ className: "h-5 w-5" })
                    ) : (
                      <Icons.Wrench className="h-5 w-5" />
                    )}
                  </div>
                  <CardTitle>{service.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-2 text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/services/${service.slug}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/services">
            <Button size="lg">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
)}