"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { InfiniteScrollList } from './InfiniteScroll'
import { getServiceProviders } from '@/app/actions/admin'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getServices } from '@/app/actions/services' // Add this import
import ProviderSkeleton from './ProviderSkeleton'
import { ProviderCard } from './provider-card'
import { ProviderModal } from './provider-modal'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { getPincodeDetails, getCitiesByState, getStates } from "@/lib/postal-api"

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
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [pincode, setPincode] = useState("")
  const [states, setStates] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState("all")
  const [cities, setCities] = useState<string[]>([])
  const [selectedDistrict, setSelectedCity] = useState("all")
  const router = useRouter()

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

    const fetchStates = async () => {
      try {
        const statesList = await getStates();
        setStates(statesList);
      } catch (error) {
        console.error('Error loading states:', error);
        setStates([]);
      }
    }
    fetchStates()
  }, []);

  // Reset data when filters change
  useEffect(() => {
    const serviceParam = searchParams.get("service")
    console.log("Service param:", serviceParam)
    if (serviceParam) {
      setFilterBy(serviceParam)
    }
 
  }, [searchParams])

  // Add new useEffect for pincode handling
  useEffect(() => {
    const handlePincodeChange = async () => {
      if (pincode.length === 6) {
        const location = await getPincodeDetails(pincode)
        if (location) {
          setSelectedState(location.state)
          setSelectedCity(location.city)
        }
      }
    }
    handlePincodeChange()
  }, [pincode])

  // Update state change effect
  useEffect(() => {
    const loadCities = async () => {
      if (selectedState && selectedState !== "all") {
        setPincode("")  // Clear pincode when state changes
        const citiesList = await getCitiesByState(selectedState)
        setCities(citiesList)
        setSelectedCity("all") // Reset city when state changes
      } else {
        setCities([])
        setSelectedCity("all")
      }
    }
    loadCities()
  }, [selectedState])

  const fetchProviders = useCallback(async (page: number, search: string) => {
    try {
      const { providers, hasMore } = await getServiceProviders(
        page, 
        10, 
        search, 
        {
          sortBy,
          filterBy: filterBy === "all" ? undefined : filterBy,
          state: selectedState === "all" ? undefined : selectedState,
          city: selectedDistrict === "all" ? undefined : selectedDistrict,
          pincode: pincode || undefined
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
  }, [sortBy, filterBy, selectedState, selectedDistrict, pincode])

  const handleBook = (provider) => {
    router.push(`/booking/new?provider=${provider._id}`)
  }

  const handleViewDetails = (provider) => {
    setSelectedProvider(provider)
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
              {services.map((service) => (
                <SelectItem key={service._id} value={service._id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-[180px]"
            maxLength={6}
          />

          <Select 
            value={selectedState} 
            onValueChange={setSelectedState}
            disabled={!!pincode}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedDistrict} 
            onValueChange={setSelectedCity}
            disabled={!selectedState || selectedState === "all" || !!pincode}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
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
                renderItem={(provider) => <ProviderCard provider={provider} onBook={handleBook} onViewDetails={handleViewDetails} />}
                initialData={initialProviders.map((p: any) => ({ ...p, _id: p._id }))}
                initialHasMore={hasMore}
                searchPlaceholder="Search providers by name or service..."
                emptyMessage="No service providers found"
                columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
              />
            )}
          </CardContent>
        </Card>

        <ProviderModal
          provider={selectedProvider}
          isOpen={!!selectedProvider}
          onClose={() => setSelectedProvider(null)}
        />
      </div>
    </div>
  )
}
