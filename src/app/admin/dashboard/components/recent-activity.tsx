import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import type { Booking, Review } from "@/app/actions/admin0"
import { Star } from "lucide-react"

interface RecentActivityProps {
  recentBookings: Booking[]
  recentReviews: Review[]
}

export function RecentActivity({ recentBookings, recentReviews }: RecentActivityProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={(booking as any)._id} className="flex items-center justify-between border-b pb-2">
                
                <div>
                  <p className="font-medium">{booking.serviceName}</p>
                  <div className="flex text-sm text-muted-foreground">
                    <p>{booking.userName}</p>
                    <span className="mx-1">•</span>
                    <p>{format(new Date(booking.bookingDate), "MMM d")}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "cancelled" || booking.status === "no-show"
                          ? "bg-red-100 text-red-800"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <span className="ml-2 font-medium">₹{booking.estimatedPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={(review as any)._id} className="border-b pb-2">
             
                <div className="flex items-center justify-between">
                  <p className="font-medium">{review.serviceName}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-1 mt-1">{review.comment}</p>
                <div className="flex text-xs text-muted-foreground mt-1">
                  <p>{review.userName}</p>
                  <span className="mx-1">•</span>
                  <p>{format(new Date(review.createdAt), "MMM d")}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
