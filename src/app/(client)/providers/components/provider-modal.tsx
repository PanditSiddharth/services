import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function ProviderModal({ provider, isOpen, onClose }) {
  const router = useRouter()

  const handleBook = () => {
    router.push(`/booking/new?provider=${provider._id}`)
  }

  if (!provider) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Provider Details</DialogTitle>
          <DialogDescription>
            View complete details and book services
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-24">
              <Image
                src={provider.profileImage || "/placeholder.svg"}
                alt={provider.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {provider.name}
                {provider.isVerified && (
                  <Badge className="bg-green-500">
                    <Icons.Check className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                )}
              </h2>
              <p className="text-muted-foreground">{provider.profession?.name}</p>
              <div className="flex items-center mt-1">
                <Icons.Star className="h-4 w-4 text-yellow-400" />
                <span className="ml-1">{provider.rating} ({provider.totalReviews} reviews)</span>
                {provider.downline > 0 && (
                  <Badge variant="outline" className="ml-2">
                    <Icons.Users className="h-3 w-3 mr-1" />
                    {provider?.downline} Downline
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <h3 className="font-medium">Services & Pricing</h3>
            <div className="space-y-2">
              {provider.services?.map((service) => (
                <div key={service._id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                  <span>{service.service?.name}</span>
                  <span>₹{service.price}/{service.priceUnit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <h3 className="font-medium">Availability</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Working Days:</span>
                <p>{provider.availability?.workingDays?.join(", ")}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Working Hours:</span>
                <p>{provider.availability?.workingHours?.start} - {provider.availability?.workingHours?.end}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={handleBook}
              disabled={!provider.availability?.isAvailable}
            >
              {provider.availability?.isAvailable ? "Book Now" : "Currently Unavailable"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
