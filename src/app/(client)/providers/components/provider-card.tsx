import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import Image from "next/image"
import { useState } from "react"
import { BookingPopup } from "./booking-popup"

interface ServiceProviderProps {
  _id: string
  name: string
  email: string
  phone: string
  profileImage: string
  profession: {
    _id: string
    name: string
    icon?: string
  }
  experience: number
  address: {
    city: string
    state: string
    pincode: string
  }
  availability: {
    isAvailable: boolean
    workingDays: string[]
    workingHours: {
      start: string
      end: string
    }
  }
  isVerified: boolean
  isActive: boolean
  rating: number
  totalReviews: number
  totalBookings: number
  completedBookings: number
  selectedDate?: string
  selectedTime?: string
}

export function ProviderCard({ 
  provider,
  onBook,
  onViewDetails 
}: { 
  provider: ServiceProviderProps,
  onBook: (provider: ServiceProviderProps) => void,
  onViewDetails: (provider: ServiceProviderProps) => void
}) {
  const [showBooking, setShowBooking] = useState(false)

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-1">
        <div className="flex gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image
              src={provider.profileImage || "/placeholder.svg"}
              alt={provider.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {provider.name}
                  {provider.isVerified && (
                    <Badge variant="secondary">
                      <Icons.Check className="h-3 w-3" />
                    </Badge>
                  )}
                  {!provider.isActive && (
                    <Badge variant="destructive" className="ml-2">Inactive</Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{provider.profession?.name}</p>
              </div>
              {provider.availability?.isAvailable && provider.isActive && (
                <Badge variant="default" className="ml-2">Available</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Icons.Star className="h-4 w-4 text-yellow-400" />
                <span>{provider.rating}</span>
                <span className="text-muted-foreground">({provider.totalReviews})</span>
              </div>
              <div className="text-muted-foreground">
                {provider.experience} years exp.
              </div>
              <div className="text-muted-foreground">
                <Icons.MapPin className="h-4 w-4 inline mr-1" />
                {provider.address.city}
              </div>
              <div className="text-muted-foreground">
                {provider.completedBookings} jobs done
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(provider)}
          >
            View Details
          </Button>
          <Button
            className="flex-1"
            onClick={() => setShowBooking(true)}
          >
            {provider.availability?.isAvailable && provider.isActive 
              ? "Check Slots" 
              : "Contact Provider"}
          </Button>
        </div>
      </CardContent>

      <BookingPopup
        provider={provider}
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        onBook={(date, time) => {
          onBook({ ...provider, selectedDate: date.toISOString(), selectedTime: time })
          setShowBooking(false)
        }}
      />
    </Card>
  )
}
