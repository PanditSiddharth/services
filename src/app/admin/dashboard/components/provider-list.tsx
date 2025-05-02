"use client"

import { format } from "date-fns"
import { type ServiceProvider, getServiceProviders } from "@/app/actions/admin"
import { InfiniteScrollList } from "./infinite-scroll-list"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Phone, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ProviderListProps {
  initialProviders: ServiceProvider[]
  initialHasMore: boolean
}

export function ProviderList({ initialProviders, initialHasMore }: ProviderListProps) {
  const fetchProviders = async (page: number, search: string) => {
    const { providers, hasMore } = await getServiceProviders(page, 10, search)
    return { data: providers, hasMore }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const renderProvider = (provider: ServiceProvider) => (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {provider.businessName.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium">{provider.businessName}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">{provider.serviceType}</span>
              <span>•</span>
              <span className="ml-2">
                {provider.city}, {provider.state}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusColor(provider.status) as any}>{provider.status}</Badge>
          <Badge variant={provider.isAvailable ? "outline" : "secondary"}>
            {provider.isAvailable ? "Available" : "Unavailable"}
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
              {provider.status === "active" ? (
                <DropdownMenuItem className="text-red-600">Suspend</DropdownMenuItem>
              ) : provider.status === "suspended" ? (
                <DropdownMenuItem className="text-green-600">Reactivate</DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-green-600">Approve</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-x-4">
        <span>Owner: {provider.ownerName}</span>
        <span>Email: {provider.email}</span>
        <span>Phone: {provider.phone}</span>
        <span>Joined: {format(new Date(provider.createdAt), "MMM d, yyyy")}</span>
      </div>
    </div>
  )

  return (
    <InfiniteScrollList
      fetchData={fetchProviders}
      renderItem={renderProvider}
      initialData={initialProviders}
      initialHasMore={initialHasMore}
      searchPlaceholder="Search providers by name, service, or location..."
      emptyMessage="No service providers found"
    />
  )
}
