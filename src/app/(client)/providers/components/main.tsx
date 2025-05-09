"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { InfiniteScrollList } from './InfiniteScroll'
import { getServiceProviders } from '@/app/actions/admin'
import Provider from './Provider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MainProps {
  initialProviders: any[]
  hasMore: boolean
}

export default function Main({ initialProviders, hasMore }: MainProps) {
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState("rating")
  const [filterBy, setFilterBy] = useState(() => searchParams.get("service") || "all")

  // Reset data when filters change
  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam) {
      setFilterBy(serviceParam)
    }
  }, [searchParams])

  const fetchProviders = async (page: number, search: string) => {
    // Pass sort and filter parameters to the API
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
        id: provider._id 
      })), 
      hasMore 
    }
  }

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
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="carpentry">Carpentry</SelectItem>
              <SelectItem value="painting">Painting</SelectItem>
              <SelectItem value="gardening">Gardening</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-6">
            <InfiniteScrollList
              fetchData={fetchProviders}
              renderItem={(provider) => <Provider provider={provider} />}
              initialData={initialProviders.map((p: any) => ({ ...p, id: p._id }))}
              initialHasMore={hasMore}
              searchPlaceholder="Search providers by name or service..."
              emptyMessage="No service providers found"
              columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
