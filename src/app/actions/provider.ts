"use server"

import connectDB from "@/lib/db-connect";
import { Booking, Review, ServiceProvider } from "@/models"

export async function getProviderStats(providerId: string) {
  await connectDB();
  
  try {
    // Get provider's bookings
    const bookings = await Booking.find({ 
      serviceProvider: providerId,
      bookingDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
    })
    .populate('service', 'name')
    .populate('subService', 'name price')
    .populate('user', 'firstName')
    .sort('-bookingDate');

    // Calculate revenue
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice), 0);

    // Get provider details including ratings
    const provider = await ServiceProvider.findById(providerId)
      .select('rating totalReviews totalBookings completedBookings');

    return {
      recentBookings: bookings.slice(0, 5),
      stats: {
        totalBookings: provider.totalBookings || 0,
        completedBookings: provider.completedBookings || 0,
        rating: provider.rating || 0,
        reviews: provider.totalReviews || 0,
        revenue: totalRevenue
      }
    };
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    throw new Error('Failed to fetch provider statistics');
  }
}

export async function getProviderBookings(providerId: string, page = 1, limit = 10) {
  await connectDB()
  
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
  await connectDB()
  
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
  await connectDB()
  
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
