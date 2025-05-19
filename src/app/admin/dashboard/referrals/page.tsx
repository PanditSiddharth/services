import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"

export default async function ReferralsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Referral Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={[
              { header: "Referrer", accessorKey: "referrer" },
              { header: "Referred", accessorKey: "referred" },
              { header: "Status", accessorKey: "status" },
              { header: "Commission", accessorKey: "commission" },
              { header: "Date", accessorKey: "createdAt" }
            ]}
            data={[]} // Fetch your referral data here
          />
        </CardContent>
      </Card>
    </div>
  )
}
