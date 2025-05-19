"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { InfiniteScrollList } from './InfiniteScroll'
import { getServiceProviders } from '@/app/actions/admin'
import Provider from './Provider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getServices } from '@/app/actions/services' // Add this import
import ProviderSkeleton from './ProviderSkeleton'

interface MainProps {
  initialProviders: any[]
  hasMore: boolean
}

export default function Main({ initialProviders, hasMore }: MainProps) {
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState("rating")
  const [filterBy, setFilterBy] = useState("all")
  const [services, setServices] = useState<{ _id: string; name: string; }[]>([])
  const [isLoading, setIsLoading] = useState(false)  // Changed initial state to false

  // Fetch services for filter
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getServices("_id name");
        setServices(services);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();
  }, []);

  // Reset data when filters change
  useEffect(() => {
    const serviceParam = searchParams.get("service")
    console.log("Service param:", serviceParam)
    if (serviceParam) {
      setFilterBy(serviceParam)
    }
 
  }, [searchParams])

  const fetchProviders = useCallback(async (page: number, search: string) => {
    try {
      const { providers, hasMore } = await getServiceProviders(
        page, 
        10, 
        search, 
        {
          sortBy,
          filterBy: filterBy === "all" ? undefined : filterBy
        }
      )

      return { 
        data: providers.map((provider: any) => ({
          ...provider,
          _id: provider._id 
        })), 
        hasMore 
      }
    } catch (error) {
      console.error("Failed to fetch providers:", error)
      return { data: [], hasMore: false }
    }
  }, [sortBy, filterBy])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Service Providers</h1>
          <p className="text-gray-600">Find and connect with professional service providers in your area</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value)
            // Reset the list when sort changes
            document.getElementById("provider-list")?.scrollTo(0, 0)
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="bookings">Most Bookings</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={(value) => {
            setFilterBy(value)
            // Reset the list when filter changes
            document.getElementById("provider-list")?.scrollTo(0, 0)
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {services.map((service) => (
                <SelectItem key={service._id} value={service._id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array(8).fill(0).map((_, i) => (
                  <ProviderSkeleton key={i} />
                ))}
              </div>
            ) : (
              <InfiniteScrollList
                fetchData={fetchProviders}
                renderItem={(provider) => <Provider provider={provider} />}
                initialData={initialProviders.map((p: any) => ({ ...p, _id: p._id }))}
                initialHasMore={hasMore}
                searchPlaceholder="Search providers by name or service..."
                emptyMessage="No service providers found"
                columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
