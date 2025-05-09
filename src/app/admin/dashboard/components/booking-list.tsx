"use client"

import { useState } from "react"
import { getBookings } from "@/app/actions/admin"
import { InfiniteScrollList } from "../../../../components/infinite-scroll-list"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Phone, Mail, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Updated interface to match the MongoDB model
interface BookingType {
  _id: string
  user: {
    _id: string
    name: string
  }
  serviceProvider: {
    _id: string
    name: string
  }
  service: {
    _id: string
    name: string
  }
  subService: {
    name: string
    price: number
    priceUnit: "hour" | "day" | "job"
  }
  bookingDate: string
  address: {
    street?: string
    city: string
    state: string
    pincode: string
    landmark?: string
    coordinates?: number[]
  }
  description: string
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"
  paymentStatus: "pending" | "partial" | "completed" | "refunded"
  paymentMethod: "cash" | "online" | "wallet"
  estimatedPrice: number
  finalPrice?: number
  serviceStartTime?: string
  serviceEndTime?: string
  totalHours?: number
  cancellationReason?: string
  cancelledBy?: "user" | "provider" | "admin"
  isReviewed: boolean
  review?: string
  createdAt: string
  updatedAt: string
}

interface BookingListProps {
  initialBookings: BookingType[]
  initialHasMore: boolean
}

export function BookingList({ initialBookings, initialHasMore }: BookingListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const fetchBookings = async (page: number, search: string) => {
    const { bookings, hasMore } = await getBookings(page, 10, search, statusFilter !== "all" ? statusFilter : undefined)
    return { data: bookings, hasMore }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "confirmed":
        return "default"
      case "in-progress":
        return "default"
      case "cancelled":
      case "no-show":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "partial":
        return "warning"
      case "refunded":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const renderBooking = (booking: BookingType) => (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium">{booking?.service?.name}</h3>
            <Badge variant={getStatusColor(booking.status) as any}>{booking.status}</Badge>
          </div>
          {booking.subService && (
            <p className="text-sm text-gray-500">{booking?.subService?.name}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{format(new Date(booking.bookingDate), "MMM d, yyyy")}</span>
            </div>
            <div>
              <Badge variant={getPaymentStatusColor(booking.paymentStatus) as any}>{booking.paymentStatus}</Badge>
            </div>
            <div>
              <Badge variant="outline">{booking.paymentMethod}</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="text-right">
            <p className="font-medium">₹{booking.estimatedPrice}</p>
            {booking.finalPrice && booking.finalPrice !== booking.estimatedPrice && (
              <p className="text-sm text-gray-500">Final: ₹{booking.finalPrice}</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Call User</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email User</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Call Provider</span>
                </DropdownMenuItem>
                {booking.status === "pending" && (
                  <DropdownMenuItem className="text-green-600">Confirm Booking</DropdownMenuItem>
                )}
                {(booking.status === "pending" || booking.status === "confirmed") && (
                  <DropdownMenuItem className="text-red-600">Cancel Booking</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
        <div>
          <span className="font-medium">User:</span> {booking?.user?.name}
        </div>
        <div>
          <span className="font-medium">Provider:</span> {booking?.serviceProvider?.name}
        </div>
        <div>
          <span className="font-medium">Location:</span> {booking?.address?.city}, {booking?.address?.state}
        </div>
        {booking.description && (
          <div>
            <span className="font-medium">Description:</span> {booking?.description?.substring(0, 50)}{booking.description.length > 50 ? '...' : ''}
          </div>
        )}
        <div>
          <span className="font-medium">Created:</span> {format(new Date(booking.createdAt), "MMM d, yyyy")}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Filter by Status</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no-show">No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <InfiniteScrollList
        fetchData={fetchBookings as any}
        renderItem={renderBooking as any}
        initialData={initialBookings as any}
        initialHasMore={initialHasMore}
        searchPlaceholder="Search bookings by user, provider, or service..."
        emptyMessage="No bookings found"
      />
    </div>
  )
}