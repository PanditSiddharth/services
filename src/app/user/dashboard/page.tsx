import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardStats } from "./components/dashboard-stats"
import { RecentBookings } from "./components/recent-bookings"
import { RecentReviews } from "./components/recent-reviews"
import { getUserDashboardStats } from "@/app/actions/user"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default async function UserDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "user") {
    redirect("/auth/customer/login")
  }

  try {
    console.log("Fetching stats for user:", user._id) // Debug log
    const stats = await getUserDashboardStats(user._id)
    console.log("Received stats:", stats) // Debug log

    if (!stats) {
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20">
              <Image
                src={user.profileImage || "/placeholder.svg"}
                alt={user.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                No dashboard data available
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    const hasBookings = stats.recentBookings && stats.recentBookings.length > 0
    const hasReviews = stats.recentReviews && stats.recentReviews.length > 0

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20">
            <Image
              src={user.profileImage || "/placeholder.svg"}
              alt={user.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <DashboardStats stats={stats} />
          
          <div className="grid gap-6 md:grid-cols-2">
            {hasBookings ? (
              <RecentBookings bookings={stats.recentBookings} />
            ) : (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    No bookings yet
                  </p>
                </CardContent>
              </Card>
            )}
            
            {hasReviews ? (
              <RecentReviews reviews={stats.recentReviews} />
            ) : (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    No reviews yet
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in UserDashboard:", error)
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20">
            <Image
              src={user.profileImage || "/placeholder.svg"}
              alt={user.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-red-500">
              Error loading dashboard data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
