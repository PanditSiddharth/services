"use client"

import { format } from "date-fns"
import { getServiceProviders } from "@/app/actions/admin"
import { InfiniteScrollList } from "./infinite-scroll-list"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Phone, Mail } from "lucide-react"
import { ServiceProviderType, ServiceType } from "@/models/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Updated interface to match the MongoDB model
// interface ServiceProviderType {
//   _id: string
//   name: string
//   email: string
//   phone: string
//   profession: {
//     _id: string
//     name: string // Assuming the Service model has a name field
//   }
//   address: {
//     city: string
//     state: string
//   }
//   availability: {
//     isAvailable: boolean
//     workingDays: string[]
//     workingHours: {
//       start: string
//       end: string
//     }
//   }
//   isVerified: boolean
//   isActive: boolean
//   rating: number
//   totalReviews: number
//   profileImage: string
//   createdAt: string
//   updatedAt: string
// }

interface ProviderListProps {
  initialProviders: ServiceProviderType[]
  initialHasMore: boolean
}

export function ProviderList({ initialProviders, initialHasMore }: ProviderListProps) {
  const fetchProviders = async (page: number, search: string) => {
    const { providers, hasMore } = await getServiceProviders(page, 10, search)
    return { data: providers, hasMore }
  }

  const getStatusBadge = (provider: ServiceProviderType) => {
    if (!provider.isActive) return { label: "suspended", variant: "destructive" }
    if (!provider.isVerified) return { label: "pending", variant: "warning" }
    return { label: "active", variant: "success" }
  }

  const renderProvider = (provider: ServiceProviderType) => {
    const statusBadge = getStatusBadge(provider)
    
    return (
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              {provider.profileImage === "/placeholder.svg" 
                ? provider.name.charAt(0)
                : <img src={provider.profileImage} alt={provider.name} className="h-10 w-10 rounded-full object-cover" />
              }
            </div>
            <div>
              <h3 className="font-medium">{provider.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">{(provider.profession as ServiceType)?.name || "Professional"}</span>
                <span>•</span>
                <span className="ml-2">
                  {provider?.address?.city}, {provider?.address?.state}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={statusBadge.variant as any}>{statusBadge.label}</Badge>
            <Badge variant={provider?.availability?.isAvailable ? "outline" : "secondary"}>
              {provider?.availability?.isAvailable ? "Available" : "Unavailable"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email Provider</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Call Provider</span>
                </DropdownMenuItem>
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                {statusBadge.label === "active" ? (
                  <DropdownMenuItem className="text-red-600">Suspend</DropdownMenuItem>
                ) : statusBadge.label === "suspended" ? (
                  <DropdownMenuItem className="text-green-600">Reactivate</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-green-600">Verify</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-x-4">
          <span>Name: {provider.name}</span>
          <span>Email: {provider.email}</span>
          <span>Phone: {provider.phone}</span>
          <span>Rating: {provider?.rating?.toFixed(1)}/5 ({provider.totalReviews} reviews)</span>
          <span>Joined: {format(new Date(provider?.createdAt + ""), "MMM d, yyyy")}</span>
        </div>
      </div>
    )
  }

  return (
    <InfiniteScrollList
      fetchData={fetchProviders as any}
      renderItem={renderProvider as any}
      initialData={initialProviders as any}
      initialHasMore={initialHasMore}
      searchPlaceholder="Search providers by name, service, or location..."
      emptyMessage="No service providers found"
    />
  )
}