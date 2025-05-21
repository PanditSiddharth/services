"use client"

import { Session } from "next-auth"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { generateReferralCode, getReferralsByProvider } from "@/app/actions/referral"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

export default function ReferralsPage() {
  const { data: session } = useSession()
  const [referrals, setReferrals] = useState([])
  const [currentCode, setCurrentCode] = useState("")

  useEffect(() => {
    // Safely check for user ID
    const userId = (session?.user as any)?._id;
    if (userId) {
      loadReferrals(userId)
    }
  }, [session])

  const loadReferrals = async (userId: string) => {
    const data = await getReferralsByProvider(userId)
    setReferrals(data)
  }

  const handleGenerateCode = async () => {
    const userId = (session?.user as any)?._id;
    if (!userId) {
      toast.error("User session not found")
      return
    }
    
    const result = await generateReferralCode(userId)
    if (result.success) {
      setCurrentCode(result.code)
      toast.success("New referral code generated!")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Referrals</CardTitle>
          <div className="space-x-4">
            {currentCode && (
              <div className="inline-flex items-center bg-muted px-4 py-2 rounded-md">
                <span className="font-mono mr-2">{currentCode}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(currentCode)
                    toast.success("Code copied!")
                  }}
                >
                  Copy
                </Button>
              </div>
            )}
            <Button onClick={handleGenerateCode}>
              Generate New Code
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={[
              { 
                header: "Referral Code",
                accessorKey: "referralCode",
              },
              { 
                header: "Referred Provider",
                accessorKey: "referred.name",
                cell: ({ row }) => row.original.referred?.name || "Pending"
              },
              { 
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => (
                  <span className={
                    row.original.status === "completed" ? "text-green-600" :
                    row.original.status === "expired" ? "text-red-600" :
                    "text-yellow-600"
                  }>
                    {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
                  </span>
                )
              },
              { 
                header: "Commission",
                accessorKey: "commission",
                cell: ({ row }) => `₹${row.original.commission}`
              },
              { 
                header: "Date",
                accessorKey: "createdAt",
                cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
              }
            ]}
            data={referrals}
          />
        </CardContent>
      </Card>
    </div>
  )
}
