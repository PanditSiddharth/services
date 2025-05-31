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
  providerStatus: "active" | "inactive" | "suspended" | "pending"
  rating: number
  totalReviews: number
  totalBookings: number
  completedBookings: number
  selectedDate?: string
  selectedTime?: string
}

export function ProviderCard({ provider, onBook, onViewDetails }: { 
  provider: ServiceProviderProps,
  onBook: (provider: ServiceProviderProps) => void,
  onViewDetails: (provider: ServiceProviderProps) => void
}) {
  const [showBooking, setShowBooking] = useState(false)

  return (
    <Card className="w-[300px] bg-white hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        {/* Header: Image + Basic Info */}
        <div className="flex gap-4 mb-4">
          {/* Left: Profile Image */}
          <div className="relative h-[80px] w-[80px] rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={provider.profileImage || "/placeholder.svg"}
              alt={provider.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Name, Profession, Badges */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{provider.name}</h3>
            <p className="text-sm text-muted-foreground truncate mb-2">
              {provider.profession?.name}
            </p>
            <div className="flex flex-wrap gap-1">
              {provider.isVerified && (
                <Badge variant="secondary" className="h-5">
                  <Icons.Check className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              {provider.availability?.isAvailable && provider.providerStatus == "active" && (
                <Badge className="bg-green-500 text-white border-0 h-5">
                  Available
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Rating Bar */}
        <div className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded-md mb-4">
          <div className="flex items-center gap-1.5">
            <Icons.Star className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="font-medium">{provider.rating}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {provider.totalReviews} reviews
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center text-muted-foreground">
            <Icons.Clock className="w-4 h-4 mr-1.5" />
            <span>{provider.experience}y exp</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Icons.MapPin className="w-4 h-4 mr-1.5" />
            <span className="truncate">{provider.address.city}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Icons.CheckCircle className="w-4 h-4 mr-1.5" />
            <span>{provider.completedBookings} done</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Icons.Calendar className="w-4 h-4 mr-1.5" />
            <span>{provider.totalBookings} total</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => setShowBooking(true)}
            disabled={!provider.availability?.isAvailable || provider.providerStatus !== "active"}
          >
            {provider.availability?.isAvailable && ["inactive", "pending"].includes(provider.providerStatus) 
              ? "Book Now" 
              : "Unavailable"}
          </Button>
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(provider)}
          >
            View
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
