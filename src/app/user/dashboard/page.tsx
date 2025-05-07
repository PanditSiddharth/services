import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UserDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "user") {
    redirect("/auth/user/login")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>View and manage your service bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">No bookings yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Reviews</CardTitle>
            <CardDescription>Reviews you{"'"}ve left for service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">No reviews yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-medium text-primary">{user?.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
