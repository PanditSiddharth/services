// app/(client)/services/[slug]/page.tsx
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link" 
import { notFound } from "next/navigation"
import { getServiceBySlug } from "@/app/actions/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { formatPrice } from "@/lib/utils" // You'll need to create this function

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)
  
  if (!service) {
    return {
      title: "Service Not Found",
    }
  }
  
  return {
    title: `${service.name} | Your Company`,
    description: service.description,
  }
}

export default async function ServiceDetailsPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug)
  
  if (!service || !service.isActive) {
    notFound()
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-6">
        <Link href="/services" className="text-primary hover:underline flex items-center gap-1">
          <Icons.ChevronLeft className="h-4 w-4" />
          Back to Services
        </Link>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-md">
                {Icons[(service.icon || "Wrench") as keyof typeof Icons] ? (
                  Icons[(service.icon || "Wrench") as keyof typeof Icons]({ className: "h-6 w-6" })
                ) : (
                  <Icons.Wrench className="h-6 w-6" />
                )}
              </div>
              <h1 className="text-3xl font-bold">{service.name}</h1>
            </div>
            <p className="text-lg text-muted-foreground">{service.description}</p>
          </div>
          
          <div className="relative w-full h-64 lg:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About this service</h2>
            <div className="prose max-w-none">
              <p>
                Our {service.name} service is designed to provide you with professional assistance
                for all your needs. Our team of experts is ready to help you with any project,
                big or small.
              </p>
              <p>
                We pride ourselves on quality workmanship, attention to detail, and customer satisfaction.
                Contact us today to learn more about how we can assist you.
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Service Options</CardTitle>
            </CardHeader>
            <CardContent>
              {!service.subServices?.length ? (
                <p className="text-muted-foreground">
                  Please contact us for pricing and availability.
                </p>
              ) : (
                <div className="space-y-4">
                  {service.subServices.map((subService:any) => (
                    <div
                      key={subService._id || subService.id}
                      className="border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{subService.name}</h3>
                        <div className="text-right">
                          <p className="font-bold">
                            {formatPrice(subService.basePrice)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            per {subService.priceUnit}
                          </p>
                        </div>
                      </div>
                      {subService.description && (
                        <p className="text-sm text-muted-foreground">
                          {subService.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6">
                <Button size="lg" className="w-full">
                  Book Now
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Or call us at (123) 456-7890
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
