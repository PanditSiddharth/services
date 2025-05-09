"use server"

import { Booking, Review, ServiceProvider } from "@/models"
import dbConnect from "@/lib/db-connect"

export async function getProviderStats(providerId: string) {
  await dbConnect()
  
  const bookings = await Booking.find({ serviceProvider: providerId }).lean()
  const currentMonth = new Date().getMonth()
  
  const stats = {
    earnings: bookings.reduce((sum, booking) => sum + (booking.finalPrice || booking.estimatedPrice), 0),
    monthlyEarnings: bookings
      .filter(booking => new Date(booking.createdAt).getMonth() === currentMonth)
      .reduce((sum, booking) => sum + (booking.finalPrice || booking.estimatedPrice), 0),
    totalBookings: bookings.length,
    completedBookings: bookings.filter(b => b.status === "completed").length,
    pendingBookings: bookings.filter(b => b.status === "pending").length
  }
  
  return JSON.parse(JSON.stringify(stats))
}

export async function getProviderBookings(providerId: string, page = 1, limit = 10) {
  await dbConnect()
  
  const bookings = await Booking.find({ serviceProvider: providerId })
    .populate('user', 'name')
    .populate('service', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  return JSON.parse(JSON.stringify(bookings))
}

export async function getProviderReviews(providerId: string, page = 1, limit = 10) {
  await dbConnect()
  
  const reviews = await Review.find({ serviceProvider: providerId })
    .populate('user', 'name profileImage')
    .populate('booking', 'service')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  return JSON.parse(JSON.stringify(reviews))
}

export async function getRevenueData(providerId: string) {
  await dbConnect()
  
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const bookings = await Booking.find({
    serviceProvider: providerId,
    createdAt: { $gte: sixMonthsAgo },
    status: "completed"
  }).lean()

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.toLocaleString('default', { month: 'short' })
    
    const monthBookings = bookings.filter(b => 
      new Date(b.createdAt).getMonth() === date.getMonth()
    )
    
    return {
      name: month,
      total: monthBookings.reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice), 0)
    }
  }).reverse()

  return JSON.parse(JSON.stringify(monthlyData))
}
