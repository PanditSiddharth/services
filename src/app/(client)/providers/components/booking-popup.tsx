import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { format } from "date-fns"

interface TimeSlot {
  time: string
  isAvailable: boolean
  bookingCount?: number
}

interface BookingPopupProps {
  provider: any
  isOpen: boolean
  onClose: () => void
  onBook: (date: Date, time: string) => void
}

export function BookingPopup({ provider, isOpen, onClose, onBook }: BookingPopupProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string>()
  const [loading, setLoading] = useState(false)

  const generateTimeSlots = (date: Date) => {
    try {
      if (!provider?.availability?.workingHours) {
        console.error("No working hours found for provider")
        return []
      }
    
      const { start, end } = provider.availability.workingHours
      const slots: TimeSlot[] = []
      
      // Convert start and end times to minutes for easier calculation
      const [startHour, startMinute] = start.split(':').map(Number)
      const [endHour, endMinute] = end.split(':').map(Number)
      
      const startTime = startHour * 60 + (startMinute || 0)
      const endTime = endHour * 60 + (endMinute || 0)
      
      // Generate slots in 30-minute intervals
      for (let time = startTime; time < endTime; time += 30) {
        const hour = Math.floor(time / 60)
        const minute = time % 60
        
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          isAvailable: true,
          bookingCount: 0
        })
      }
      
      return slots
    } catch (error) {
      console.error("Error generating time slots:", error)
      return []
    }
  }

  useEffect(() => {
    if (selectedDate && provider?.availability) {
      setLoading(true)
      try {
        const slots = generateTimeSlots(selectedDate)
        setAvailableSlots(slots)
      } catch (error) {
        console.error("Error setting available slots:", error)
        setAvailableSlots([])
      } finally {
        setLoading(false)
      }
    }
  }, [selectedDate, provider])

  const handleDateSelect = (date: Date | undefined) => {
      if (date) {
        setSelectedDate(date)
        setSelectedSlot(undefined)
      }
    }

  const handleTimeSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot.time)
  }

  const handleBook = () => {
    if (selectedDate && selectedSlot) {
      const bookingDateTime = new Date(selectedDate)
      const [hours, minutes] = selectedSlot.split(':')
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes))
      onBook(bookingDateTime, selectedSlot)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Select your preferred date and time slot
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                // Disable past dates and days when provider is not working
                const day = format(date, 'EEEE')
                return (
                  date < new Date() || 
                  !provider.availability?.workingDays?.includes(day)
                )
              }}
              className="rounded-md border"
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Available Time Slots</h3>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Icons.Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : selectedDate ? (
              <div className="grid grid-cols-2 gap-2">
                {Array.isArray(availableSlots) && availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedSlot === slot.time ? "default" : "outline"}
                      className="w-full"
                      onClick={() => handleTimeSelect(slot)}
                    >
                      {slot.time}
                      {slot.bookingCount && slot.bookingCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {slot.bookingCount}
                        </Badge>
                      )}
                    </Button>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-muted-foreground">
                    No available slots for this date
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Please select a date first
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleBook}
            disabled={!selectedDate || !selectedSlot}
          >
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
