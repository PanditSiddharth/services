import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Clock, Star, CheckCircle, XCircle } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalBookings: number
    pendingBookings: number
    completedBookings: number
    cancelledBookings: number
    avgRating: number
    totalReviews: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  // Ensure we have valid stats with default values
  const safeStats = {
    totalBookings: stats?.totalBookings || 0,
    pendingBookings: stats?.pendingBookings || 0,
    completedBookings: stats?.completedBookings || 0,
    cancelledBookings: stats?.cancelledBookings || 0,
    avgRating: stats?.avgRating || 0,
    totalReviews: stats?.totalReviews || 0,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.totalBookings}</div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              {safeStats.completedBookings}
            </span>
            <span className="flex items-center">
              <XCircle className="h-3 w-3 mr-1 text-red-500" />
              {safeStats.cancelledBookings}
            </span>
            <span>{safeStats.pendingBookings} pending</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service History</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.completedBookings}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Completed services
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Reviews</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.avgRating.toFixed(1)}/5</div>
          <p className="text-xs text-muted-foreground mt-1">
            {safeStats.totalReviews} reviews given
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
