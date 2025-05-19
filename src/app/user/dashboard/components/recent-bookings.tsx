import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Booking {
  _id: string
  serviceName: string
  serviceIcon?: string
  providerName: string
  providerImage: string
  status: string
  bookingDate: string
  estimatedPrice: number
}

export function RecentBookings({ bookings }: { bookings: Booking[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={(booking as any)._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center space-x-4">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={booking.providerImage || "/placeholder.svg"}
                    alt={booking.providerName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{booking.serviceName}</p>
                  <div className="flex text-sm text-muted-foreground">
                    <p>{booking.providerName}</p>
                    <span className="mx-1">•</span>
                    <p>{formatDistanceToNow(new Date(booking.bookingDate), { addSuffix: true })}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    booking.status === "default" ? "default" :
                    booking.status === "default" ? "default" :
                    booking.status === "default" ? "default" : "default"
                  }
                >
                  {booking.status}
                </Badge>
                <span className="text-sm font-medium">₹{booking.estimatedPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
