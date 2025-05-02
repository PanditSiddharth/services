import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Store, ShoppingBag, CheckCircle, XCircle, DollarSign, Star } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    counts: {
      totalUsers: number
      activeUsers: number
      totalProviders: number
      activeProviders: number
      verifiedProviders: number
      totalServices: number
      activeServices: number
      totalSubServices: number
      totalBookings: number
      pendingBookings: number
      completedBookings: number
      cancelledBookings: number
    }
    financial: {
      totalRevenue: number
      averageOrderValue: number
    }
    satisfaction: {
      averageRating: number
      totalReviews: number
    }
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.totalUsers}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.counts.activeUsers} active users (
            {Math.round((stats.counts.activeUsers / stats.counts.totalUsers) * 100)}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.totalProviders}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.counts.verifiedProviders} verified (
            {Math.round((stats.counts.verifiedProviders / stats.counts.totalProviders) * 100)}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Services</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.totalServices}</div>
          <p className="text-xs text-muted-foreground mt-1">{stats.counts.totalSubServices} sub-services</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bookings</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.totalBookings}</div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              {stats.counts.completedBookings}
            </span>
            <span className="flex items-center">
              <XCircle className="h-3 w-3 mr-1 text-red-500" />
              {stats.counts.cancelledBookings}
            </span>
            <span>{stats.counts.pendingBookings} pending</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats.financial.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Avg. ₹{Math.round(stats.financial.averageOrderValue).toLocaleString()} per booking
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.satisfaction.averageRating.toFixed(1)}/5</div>
          <p className="text-xs text-muted-foreground mt-1">Based on {stats.satisfaction.totalReviews} reviews</p>
        </CardContent>
      </Card>
    </div>
  )
}
