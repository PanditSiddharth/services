import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { SettingsForm } from "./components/settings-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "user") {
    redirect("/auth/customer/login")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <TabsContent value="profile">
            <SettingsForm user={user} />
          </TabsContent>

          <TabsContent value="security">
            <div className="text-muted-foreground">
              Security settings coming soon...
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="text-muted-foreground">
              Notification preferences coming soon...
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
}
