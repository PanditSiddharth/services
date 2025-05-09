"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getProviderReviews } from "@/app/actions/provider"
import { format } from "date-fns"
import { Star } from "lucide-react"

export function ReviewsList({ providerId }: { providerId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    const data = await getProviderReviews(providerId)
    setReviews(data)
    setLoading(false)
  }

  if (loading) return <div>Loading reviews...</div>

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review._id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img 
                    src={review.user.profileImage || "/placeholder.svg"}
                    alt={review.user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{review.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(review.createdAt), "PPP")}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-4">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
      {reviews.length === 0 && (
        <p className="text-center text-muted-foreground">No reviews yet</p>
      )}
    </div>
  )
}
