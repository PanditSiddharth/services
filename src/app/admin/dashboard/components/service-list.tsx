"use client"

import { useState } from "react"
import { InfiniteScrollList } from "../../../../components/infinite-scroll-list"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash, Plus, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { getServices } from "@/app/actions/admin"

// Updated interface to match the MongoDB model
interface SubService {
  _id: string
  name: string
  description?: string
  basePrice: number
  priceUnit: "hour" | "day" | "job"
}

interface Service {
  _id: string
  name: string
  slug: string
  description: string
  icon: string
  image: string
  isActive: boolean
  subServices: SubService[]
  providers: string[] // Array of ServiceProvider IDs
  createdAt: string
  updatedAt: string
}

interface ServiceListProps {
  initialServices: Service[]
  initialHasMore: boolean
}

export function ServiceList({ initialServices, initialHasMore }: ServiceListProps) {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())

  const fetchServices = async (page: number, search: string) => {
    const { services, hasMore } = await getServices(page, 10, search)
    return { data: services, hasMore }
  }

  const toggleExpand = (serviceId: string) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  const renderService = (service: Service) => (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {service.image !== "/placeholder.svg" ? (
              <img 
                src={service.image} 
                alt={service.name} 
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {service.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-medium">{service.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{service.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={service.isActive ? "outline" : "secondary"}>
              {service.isActive ? "Active" : "Inactive"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => toggleExpand(service._id)}>
              {expandedServices.has(service._id) ? "Hide Details" : "Show Details"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Service</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Service</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Sub-Service</span>
                </DropdownMenuItem>
                {service.isActive ? (
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Deactivate</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-green-600">
                    <span>Activate</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>Created: {format(new Date(service.createdAt), "MMM d, yyyy")}</span>
          <span>Providers: {service?.providers?.length}</span>
        </div>
      </div>

      {expandedServices.has(service._id) && (
        <div className="bg-gray-50 p-4 border-t">
          <h4 className="font-medium mb-2">Sub-Services ({service?.subServices?.length})</h4>
          <div className="space-y-2">
            {service.subServices.map((subService) => (
              <div key={subService.name} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">{subService.name}</h5>
                    {subService.description && <p className="text-sm text-gray-500">{subService.description}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{subService.basePrice}</p>
                    <p className="text-xs text-gray-500">per {subService.priceUnit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )

  return (
    <InfiniteScrollList
      fetchData={fetchServices as any}
      renderItem={renderService as any}
      initialData={initialServices as any}
      initialHasMore={initialHasMore}
      searchPlaceholder="Search services by name or description..."
      emptyMessage="No services found"
    />
  )
}