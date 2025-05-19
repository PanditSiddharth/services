import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Star } from "lucide-react"
import Image from "next/image"

interface Review {
  _id: string
  serviceName: string
  serviceIcon?: string
  providerName: string
  providerImage: string
  rating: number
  comment: string
  createdAt: string
}

export function RecentReviews({ reviews }: { reviews: Review[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={(review as any)._id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center space-x-4">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={review.providerImage || "/placeholder.svg"}
                    alt={review.providerName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.serviceName}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.providerName}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
