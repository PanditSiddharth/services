// app/admin/dashboard/components/recent-services.tsx
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface Service {
  _id: string
  name: string
  slug: string
  isActive: boolean
  createdAt: string
  subServices: any[]
}

export function RecentServices({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-muted-foreground">No recent services</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div
          key={service._id}
          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{service.name}</h3>
              <Badge variant={service.isActive ? "default" : "outline"}>
                {service.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(service.createdAt), { addSuffix: true })}
              </p>
              <span className="text-xs text-muted-foreground">•</span>
              <p className="text-xs text-muted-foreground">
                {service.subServices.length} sub-services
              </p>
            </div>
          </div>
          <Link href={`/admin/services/${service._id}`}>
            <Button variant="ghost" size="sm">
              <Icons.ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ))}
      
      <div className="pt-2">
        <Link href="/admin/services">
          <Button variant="outline" size="sm" className="w-full">
            View All Services
          </Button>
        </Link>
      </div>
    </div>
  )
}