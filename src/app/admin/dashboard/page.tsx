import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getUsers,
  getServiceProviders,
  getServices,
  getBookings,
  getReviews,
} from "@/app/actions/admin";
import { getDashboardStats } from "@/app/actions/admin0"
import { UserList } from "./components/users-list"
import { ProviderList } from "./components/provider-list"
import { ServiceList } from "./components/service-list"
import { BookingList } from "./components/booking-list"
import { ReviewList } from "./components/review-list"
import { DashboardStats } from "./components/dashboard-stats"
import { RecentActivity } from "./components/recent-activity"
import { BookingChart } from "./components/booking-chart"

export default async function DashboardPage() {
  // Fetch initial data for all lists
  const { users, pagination: { hasMore: hasMoreUsers }} = await getUsers(1, 10)
  const { providers, hasMore: hasMoreProviders } = await getServiceProviders(1, 10)
  const { services, hasMore: hasMoreServices } = await getServices(1, 10)
  const { bookings, hasMore: hasMoreBookings } = await getBookings(1, 10)
  const { reviews, pagination: { hasMore: hasMoreReviews } } = await getReviews(1, 10)

  // Get dashboard statistics
  const stats = await getDashboardStats()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <DashboardStats stats={stats} />

      <div className="mt-8 space-y-8">
        <RecentActivity recentBookings={stats.recent.bookings} recentReviews={stats.recent.reviews} />

        <BookingChart data={stats.analytics.monthlyBookings} />

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="providers">Service Providers</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>Manage all services offered on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceList initialServices={services as any} initialHasMore={hasMoreServices} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Providers</CardTitle>
                <CardDescription>Manage all service providers registered on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderList initialProviders={providers as any} initialHasMore={hasMoreProviders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage all users registered on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <UserList initialUsers={users as any} initialHasMore={hasMoreUsers} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bookings</CardTitle>
                <CardDescription>Manage all service bookings on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingList initialBookings={bookings as any} initialHasMore={hasMoreBookings} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>Manage all customer reviews on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewList initialReviews={reviews} initialHasMore={hasMoreReviews} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
