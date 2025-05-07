"use client"
import { useState } from "react"
import { type Review, getReviews } from "@/app/actions/admin0"
import { InfiniteScrollList } from "./infinite-scroll-list"
import { MoreHorizontal, Star, Flag, ThumbsDown, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReviewListProps {
  initialReviews: Review[]
  initialHasMore: boolean
}

export function ReviewList({ initialReviews, initialHasMore }: ReviewListProps) {
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const fetchReviews = async (page: number, search: string) => {
    const minRating = ratingFilter !== "all" ? Number.parseInt(ratingFilter) : undefined
    const { reviews, hasMore } = await getReviews(page, 10, search, minRating)
    return { data: reviews, hasMore }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const renderReview = (review: Review) => (
    <Card className="p-4">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{review.serviceName}</h3>
            {renderStars(review.rating)}
          </div>
          <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Booking</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className="mr-2 h-4 w-4" />
                <span>Flag as Inappropriate</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <ThumbsDown className="mr-2 h-4 w-4" />
                <span>Remove Review</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
        <div>
          <span className="font-medium">User:</span> {review.userName}
        </div>
        <div>
          <span className="font-medium">Provider:</span> {review.providerName}
        </div>
        <div>
          <span className="font-medium">Date:</span> {format(new Date(review.createdAt), "MMM d, yyyy")}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Filter by Rating</h3>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="2">2+ Stars</SelectItem>
            <SelectItem value="1">1+ Star</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <InfiniteScrollList
        fetchData={fetchReviews}
        renderItem={renderReview}
        initialData={initialReviews}
        initialHasMore={initialHasMore}
        searchPlaceholder="Search reviews by user, provider, or content..."
        emptyMessage="No reviews found"
      />
    </div>
  )
}
