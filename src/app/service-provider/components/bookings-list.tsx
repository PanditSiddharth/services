"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getProviderBookings } from "@/app/actions/provider"
import { format } from "date-fns"

export function BookingsList({ providerId }: { providerId: string }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadBookings()
  }, [page])

  const loadBookings = async () => {
    const data = await getProviderBookings(providerId, page)
    setBookings(data as any)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "default",
      confirmed: "outline",
      completed: "secondary",
      cancelled: "destructive"
    }
    return colors[status as keyof typeof colors] as "secondary" || "secondary"
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <Card key={booking._id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{booking.service.name}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(booking.bookingDate), "PPP")}
              </p>
            </div>
            <Badge variant={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">
              <p>Customer: {booking.user.name}</p>
              <p>Amount: ₹{booking.finalPrice || booking.estimatedPrice}</p>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
