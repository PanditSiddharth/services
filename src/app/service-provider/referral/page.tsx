"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import { Icons } from "@/components/icons"
import { generateReferralToken, getReferralStats, revokeReferralCode } from "@/app/actions/referral"
import type { ReferralData } from "@/types/referral"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ReferralPage() {
  const { data: session } = useSession()
  const [referralData, setReferralData] = useState<ReferralData>({
    pendingCodes: [],
    activeCodes: [],
    completedCodes: [],
    revokedCodes: [],
    stats: {
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      revokedReferrals: 0
    },
    currentCode: null // Add default value for currentCode
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [copyingItem, setCopyingItem] = useState<"code" | "link" | null>(null)
  const [customCode, setCustomCode] = useState("")
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const [selectedCode, setSelectedCode] = useState<any>(null)

  const loadReferralStats = async () => {
    if (!session?.user) return
    
    try {
      const result = await getReferralStats((session.user as any)._id)
      
      if (result.success && result.data) {
        // Transform the data to match ReferralData structure
        const transformedData: ReferralData = {
          pendingCodes: result.data.activeCodes,
          activeCodes: result.data.activeCodes,
          completedCodes: result.data.completedCodes,
          revokedCodes: result.data.revokedCodes,
          currentCode: result.data.activeCodes[0] || null,
          stats: result.data.stats
        }
        setReferralData(transformedData)
      }
    } catch (error) {
      console.error("Error loading referral stats:", error)
      toast.error("Failed to load referral statistics")
    }
  }

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setCustomCode(value.slice(0, 6)) // Limit to 6 characters
  }

  const handleGenerateToken = async (customCodeValue?: string) => {
    if (!session?.user) return

    setIsGenerating(true)
    try {
      const result = await generateReferralToken(
        (session.user as any)._id,
        customCodeValue || undefined
      )
      if (result.success && result.data) {
        setReferralData(prev => ({
          ...prev,
          currentCode: result.data.currentCode
        }))
        setCustomCode("")
        toast.success("Referral code generated successfully")
        loadReferralStats() // Reload all stats
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate referral code")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyToClipboard = async (type: "code" | "link", text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyingItem(type)
      toast.success(`${type === "code" ? "Code" : "Link"} copied to clipboard`)
      setTimeout(() => setCopyingItem(null), 2000)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleRevoke = async () => {
    if (!session?.user || !referralData.currentCode) return
    
    setRevoking(true)
    try {
      const result = await revokeReferralCode(
        (session.user as any)._id,
        referralData.currentCode.code
      )
      
      if (result.success) {
        toast.success("Referral code revoked successfully")
        loadReferralStats() // Reload stats
        setReferralData(prev => ({ ...prev, currentCode: null }))
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to revoke code")
    } finally {
      setRevoking(false)
      setShowRevokeDialog(false)
    }
  }

  useEffect(() => {
    loadReferralStats()
  }, [session])

  interface ReferralTableProps {
    title: string;
    items: any[];
    showProgress?: boolean;
    showRevoked?: boolean;
  }

  const ReferralTable = ({ title, items, showProgress, showRevoked }: ReferralTableProps) => {
    // Filter out revoked codes with no referrals
    const filteredItems = showRevoked 
      ? items.filter(item => item.hadReferrals)
      : items;

    return (
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Code</th>
                {showProgress && <th className="pb-2">Progress</th>}
                <th className="pb-2">Created</th>
                {showRevoked ? (
                  <>
                    <th className="pb-2">Referred Users</th>
                    <th className="pb-2">Revoked Date</th>
                  </>
                ) : (
                  <th className="pb-2">Status</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.length > 0 ? filteredItems.map((item) => (
                <tr key={item.code} className="text-sm">
                  <td className="py-2 font-mono">{item.code}</td>
                  {showProgress && (
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span>{item.progress}%</span>
                      </div>
                    </td>
                  )}
                  <td className="py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                  {showRevoked ? (
                    <>
                      <td className="py-2">{item.referredCount}</td>
                      <td className="py-2">{new Date(item.revokedAt).toLocaleDateString()}</td>
                    </>
                  ) : (
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'revoked' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={showRevoked ? 4 : 3} className="text-center py-4 text-gray-500">
                    No {title.toLowerCase()} found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>Generate and share your referral token to earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Codes Section */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-blue-800">Active Referral Codes</h3>
              <Button
                size="sm"
                onClick={() => handleGenerateToken(customCode)}
                disabled={isGenerating || referralData.activeCodes.length >= 5}
              >
                {isGenerating ? (
                  <>
                    <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Icons.Plus className="mr-2 h-4 w-4" />
                    New Code
                  </>
                )}
              </Button>
            </div>

            {referralData.activeCodes.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No active referral codes. Generate one to start referring!
              </div>
            ) : (
              <div className="space-y-4">
                {referralData.activeCodes.map((code) => (
                  <div key={code.code} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <code className="font-mono text-lg">{code.code}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCode(code);
                          setShowRevokeDialog(true);
                        }}
                      >
                        <Icons.X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icons.Calendar className="h-4 w-4" />
                      {new Date(code.createdAt).toLocaleDateString()}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard("code", code.code)}
                      >
                        Copy Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard("link", code.link)}
                      >
                        Copy Link
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Code Input */}
            {referralData.activeCodes.length < 5 && (
              <div className="mt-4">
                <Input
                  placeholder="Enter custom code (optional)"
                  value={customCode}
                  onChange={handleCustomCodeChange}
                  className="font-mono uppercase max-w-xs"
                  maxLength={6}
                />
              </div>
            )}
          </div>

          {/* Active Referral Section */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-blue-800">Active Referral Code</h3>
              <div className="flex gap-2">
                {referralData.currentCode ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateToken()}
                      disabled={isGenerating}
                    >
                      New Code
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowRevokeDialog(true)}
                      disabled={revoking}
                    >
                      {revoking ? (
                        <Icons.Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Revoke"
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleGenerateToken(customCode)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate Code"}
                  </Button>
                )}
              </div>
            </div>

            {referralData.currentCode ? (
              <div className="space-y-2">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Input 
                      value={referralData.currentCode.code} 
                      readOnly 
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleCopyToClipboard("code", referralData.currentCode?.code || "")}
                      className="flex items-center gap-2"
                    >
                      {copyingItem === "code" ? (
                        <>
                          <Icons.Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Icons.Copy className="h-4 w-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={referralData.currentCode.link} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleCopyToClipboard("link", referralData.currentCode?.link || "")}
                      className="flex items-center gap-2"
                    >
                      {copyingItem === "link" ? (
                        <>
                          <Icons.Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Icons.Link className="h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Custom code (optional)"
                  value={customCode}
                  onChange={handleCustomCodeChange}
                  className="font-mono uppercase max-w-xs"
                  maxLength={6}
                />
              </div>
            )}
          </div>

          {/* Active Referrals Section */}
          <ReferralTable 
            title="Active Referrals" 
            items={referralData.pendingCodes} 
            showProgress={true}
          />
          
          {/* Revoked Referrals Section */}
          <ReferralTable 
            title="Revoked Referrals" 
            items={referralData.revokedCodes} 
            showRevoked={true}
          />
          
          {/* Completed Referrals Section */}
          <ReferralTable 
            title="Completed Referrals" 
            items={referralData.completedCodes} 
            showProgress={true}
          />

          {/* Stats Section */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Referral Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(referralData.activeCodes || []).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(referralData.completedCodes || []).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {referralData.stats.totalReferrals || 0}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Revoke Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Referral Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this referral code? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRevokeDialog(false)}
              disabled={revoking}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={revoking}
            >
              {revoking ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                "Revoke Code"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
