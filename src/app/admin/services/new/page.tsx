// app/admin/services/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceForm } from "../components/service-form"

export default function NewServicePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Service</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceForm />
        </CardContent>
      </Card>
    </div>
  )
}