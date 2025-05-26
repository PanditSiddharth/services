"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { Icons } from "@/components/icons"
import { generateReferralToken, getReferralStats, revokeReferral } from "@/app/actions/referral"
import { ChevronLeft, Users, User, ChevronRight } from "lucide-react"

interface ReferralNode {
  _id: string
  name: string
  profileImage?: string
  profession: { _id: string; name: string }
  level?: number
  referralCode?: string
  referred?: ReferralNode[]
  referrer?: ReferralNode
  downline?: number
}

export default function ReferralPage() {
  const { data: session } = useSession()
  const [currentView, setCurrentView] = useState<ReferralNode | null>(null)
  const [referralHistory, setReferralHistory] = useState<ReferralNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customCode, setCustomCode] = useState("")
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [revoking, setRevoking] = useState(false)

  const loadReferralData = async (userId: string) => {
    setIsLoading(true)
    try {
      const result = await getReferralStats(userId)
      if (result.success && result.data) {
        const newNode: ReferralNode = {
          _id: result.data.me!._id,
          name: result.data.me!.name,
          profileImage: result.data.me!.profileImage,
          profession: result.data.me!.profession as { _id: string; name: string },
          level: Number(result.data.me!.level),
          downline: result.data.me?.downline || 0,
          referralCode: result.data?.currentCode?.code,
          referred: result.data?.referred?.map(ref => ({
            _id: ref._id,
            name: ref.name,
            profileImage: ref.profileImage,
            profession: ref?.profession as unknown as { _id: string; name: string },
            downline: ref.downline || 0
          })),
          referrer: result.data.referrer ? {
            _id: result.data.referrer._id,
            name: result.data.referrer.name,
            profileImage: result.data.referrer.profileImage,
            profession: result.data.referrer.profession as unknown as { _id: string; name: string },
            downline: result.data.referrer.downline || 0
          } : undefined
        }
        setCurrentView(newNode)
        setStats(result.data)
      }
    } catch (error) {
      toast.error("Failed to load referral data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewMember = async (member: ReferralNode) => {
    setReferralHistory(prev => [...prev, currentView!])
    await loadReferralData(member._id)
  }

  const handleBack = () => {
    const previous = referralHistory.pop()
    if (previous) {
      setCurrentView(previous)
      setReferralHistory([...referralHistory])
    }
  }

  const loadReferralStats = async () => {
    if (!session?.user) return
    
    try {
      const result = await getReferralStats((session.user as any)._id)
      if (result.success && result.data) {
        setStats(result.data)
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
        loadReferralStats() // Reload stats after generating new code
        setCustomCode("")
        toast.success("Referral code generated successfully")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate referral code")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRevoke = async () => {
    if (!session?.user || !stats?.currentCode) return
    
    setRevoking(true)
    try {
      const result = await revokeReferral(stats?.currentCode.code)
      
      if (result.success) {
        toast.success("Referral code revoked successfully")
        loadReferralStats() // Reload stats
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
    if (session?.user) {
      loadReferralData((session.user as any)._id)
    }
  }, [session])

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Referral Network</CardTitle>
              <CardDescription>View your referral tree and network</CardDescription>
            </div>
            {referralHistory.length > 0 && (
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current View Member Card */}
          {currentView && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-white">
                  <img
                    src={currentView.profileImage || "/placeholder.png"}
                    alt={currentView.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{currentView.name}</h3>
                  <p className="text-sm text-gray-600">{currentView.profession.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Level {currentView.level || 0}
                    </span>

                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        <Users className="h-3 w-3 inline mr-1" />
                        {currentView?.downline || 0} Downline
                      </span>
                    
                    {currentView.referralCode && (
                      <span className="font-mono text-sm">
                        Code: {currentView.referralCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referrer Section */}
          {currentView?.referrer && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <User className="h-4 w-4" />
                Referred By
              </h4>
              <div 
                className="p-4 bg-gray-50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100"
                onClick={() => handleViewMember(currentView.referrer!)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src={currentView.referrer.profileImage || "/placeholder.png"}
                      alt={currentView.referrer.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium">{currentView.referrer.name}</h5>
                    <p className="text-sm text-gray-500">{currentView.referrer.profession.name}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Referred Members Section */}
          {currentView?.referred && currentView?.referred.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Referred Members ({currentView?.referred.length})
              </h4>
              <div className="space-y-2">
                {currentView?.referred.map((member) => (
                  <div 
                    key={member._id}
                    className="p-4 bg-gray-50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100"
                    onClick={() => handleViewMember(member)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={member.profileImage || "/placeholder.png"}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">{member.name}</h5>
                        <p className="text-sm text-gray-500">{member?.profession?.name}</p>
                        
                          <p className="text-xs text-green-600">
                            <Users className="h-3 w-3 inline mr-1" />
                            {member?.downline || 0} Downline
                          </p>
                        
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Section */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Your Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Referrals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.referred?.length || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Remaining Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.max(0, 3 - (stats?.referred?.length || 0))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Current Code Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-blue-800">Your Referral Code</h3>
              <Button
                size="sm"
                onClick={() => handleGenerateToken(customCode)}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Code"
                )}
              </Button>
            </div>

            {stats?.currentCode ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <code className="font-mono text-lg">{stats?.currentCode.code}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRevokeDialog(true)}
                    >
                      <Icons.X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(stats?.currentCode!.code)
                        toast.success("Code copied!")
                      }}
                    >
                      Copy Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(stats?.currentCode!.link)
                        toast.success("Link copied!")
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No active referral code. Generate one to start referring!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revoke Dialog */}
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
