import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "@/components/custom-calendar"

interface TimeSlot {
  time: string
  isAvailable: boolean
  bookingCount?: number
}

interface BookingPopupProps {
  provider: any
  isOpen: boolean
  onClose: () => void
  onBook: (date: Date, time: string, duration: number, description: string) => void
}

const BookingFormSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time slot"),
  duration: z.number().min(30).max(120),
  description: z.string().min(10, "Please describe your requirement in more detail"),
})

export function BookingPopup({ provider, isOpen, onClose, onBook }: BookingPopupProps) {
  const [loading, setLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [bookingLoading, setBookingLoading] = useState(false)

  const form = useForm<z.infer<typeof BookingFormSchema>>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      duration: 30,
      description: "",
    },
  })

  const generateTimeSlots = (date: Date) => {
    try {
      if (!provider?.availability?.workingHours) {
        return []
      }
    
      const { start, end } = provider.availability.workingHours
      const slots: TimeSlot[] = []
      
      const [startHour, startMinute] = start.split(':').map(Number)
      const [endHour, endMinute] = end.split(':').map(Number)
      
      const startTime = startHour * 60 + (startMinute || 0)
      const endTime = endHour * 60 + (endMinute || 0)
      
      // Generate slots based on duration
      for (let time = startTime; time < endTime; time += 30) {
        const hour = Math.floor(time / 60)
        const minute = time % 60
        
        // Check if this slot is already booked
        const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const isBooked = provider.bookedSlots?.some(
          (slot: any) => 
            slot.date === date.toISOString().split('T')[0] && 
            slot.time === slotTime
        )
        
        slots.push({
          time: slotTime,
          isAvailable: !isBooked,
          bookingCount: isBooked ? 1 : 0
        })
      }
      
      return slots
    } catch (error) {
      console.error("Error generating time slots:", error)
      return []
    }
  }

  useEffect(() => {
    const selectedDate = form.watch("date")
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
  }, [form.watch("date"), provider])

  async function onSubmit(data: z.infer<typeof BookingFormSchema>) {
    try {
      setBookingLoading(true)
      await onBook(data.date, data.time, data.duration, data.description)
      onClose()
    } catch (error) {
      form.setError("root", { message: "Failed to book appointment" })
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] p-6">
        <DialogHeader>
          <DialogTitle>Book Appointment with {provider.name}</DialogTitle>
          <DialogDescription>
            Available {provider.availability?.workingDays?.join(", ")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Calendar Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Date</FormLabel>
                      <CustomCalendar
                        selectedDate={field.value}
                        onDateSelect={field.onChange}
                        disabledDates={(date) => {
                          const day = format(date, 'EEEE')
                          const isPastDate = date < new Date(new Date().setHours(0,0,0,0))
                          const isWorkingDay = provider.availability?.workingDays?.includes(day)
                          return isPastDate || !isWorkingDay
                        }}
                        className="border-none p-0"
                      />
                    </FormItem>
                  )}
                />

                {/* Working Hours Info */}
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <Icons.Clock className="h-4 w-4" />
                    <span>{provider.availability?.workingHours?.start} - {provider.availability?.workingHours?.end}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Calendar className="h-4 w-4" />
                    <span className="line-clamp-2">{provider.availability?.workingDays?.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="space-y-4">
                {/* Duration & Time Slots */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <select
                        {...field}
                        className="w-full rounded-md border p-2"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Slot</FormLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {loading ? (
                          <div className="col-span-full flex justify-center py-4">
                            <Icons.Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : availableSlots.length > 0 ? (
                          availableSlots.map((slot) => (
                            <Button
                              key={slot.time}
                              type="button"
                              variant={field.value === slot.time ? "default" : "outline"}
                              className={cn("w-full", !slot.isAvailable && "opacity-50")}
                              onClick={() => field.onChange(slot.time)}
                              disabled={!slot.isAvailable}
                            >
                              {slot.time}
                              {!slot.isAvailable && (
                                <Badge variant="secondary" className="ml-2">Booked</Badge>
                              )}
                            </Button>
                          ))
                        ) : (
                          <p className="col-span-full text-center text-muted-foreground py-4">
                            {form.watch("date") ? "No available slots" : "Select a date first"}
                          </p>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Details</FormLabel>
                  <textarea
                    {...field}
                    className="w-full h-24 rounded-md border p-2 resize-none"
                    placeholder="Please describe your service requirement or problem in detail..."
                  />
                </FormItem>
              )}
            />

            {/* Form Error */}
            {form.formState.errors.root && (
              <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={bookingLoading}>
                {bookingLoading ? (
                  <>
                    <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
