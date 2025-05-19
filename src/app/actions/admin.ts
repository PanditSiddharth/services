"use server"

import dbConnect from '@/lib/db-connect'
import { User, ServiceProvider, Service, Booking, Review } from '@/models/index'
import { Types } from 'mongoose'; // Add this import at the top
// Types for our data
export type User = {
    _id: string;
    name: string
    email: string
    phone: string
    createdAt: string
    lastLogin?: string
    status: "active" | "inactive"
  }
  
  export type ServiceProvider = {
    _id: string;
    businessName: string
    ownerName: string
    email: string
    phone: string
    serviceType: string
    experience: number
    city: string
    state: string
    isAvailable: boolean
    isVerified: boolean
    rating: number
    totalReviews: number
    totalBookings: number
    completedBookings: number
    createdAt: string
    status: "active" | "pending" | "suspended"
  }
  
  export type Service = {
    _id: string;
    name: string
    slug: string
    description: string
    icon: string
    image: string
    isActive: boolean
    subServices: {
      _id: string;
      name: string
      description?: string
      basePrice: number
      priceUnit: "hour" | "day" | "job"
    }[]
    providersCount: number
    createdAt: string
    updatedAt: string
  }
  
  export type Booking = {
    _id: string;
    userId: string
    userName: string
    providerId: string
    providerName: string
    serviceId: string
    serviceName: string
    subServiceName: string
    bookingDate: string
    address: {
      city: string
      state: string
      pincode: string
    }
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"
    paymentStatus: "pending" | "partial" | "completed" | "refunded"
    paymentMethod: "cash" | "online" | "wallet"
    estimatedPrice: number
    finalPrice?: number
    createdAt: string
  }
  
  export type Review = {
    _id: string;
    userId: string
    userName: string
    providerId: string
    providerName: string
    bookingId: string
    serviceId: string
    serviceName: string
    rating: number
    comment: string
    createdAt: string
  }
  
// Server actions to fetch paginated data from MongoDB
export async function getUsers(page = 1, limit = 10, search = "") {
    try {
      await dbConnect()
      // Validate and sanitize inputs
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Math.min(100, Number(limit))); // Cap at 100 for performance
      const searchTerm = (search || "").trim();
      
      // Build search query
      let query = {};
      if (searchTerm) {
        query = {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { phone: { $regex: searchTerm, $options: 'i' } }
          ]
        };
      }
  
      // Pagination calculations
      const skip = (pageNum - 1) * limitNum;
      
      // Execute count query and data query in parallel for better performance
      const [totalCount, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
          .select('name email phone profileImage role isActive createdAt updatedAt address') // Select only needed fields
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean() // For better performance
      ]);
      
      // Check if there are more pages
      const hasMore = skip + users.length < totalCount;
      
      // Map MongoDB documents to the expected format with proper error handling
      const formattedUsers = users.map(user => ({
        _id: user._id?.toString() || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '/placeholder.svg',
        role: user.role || 'user',
        isActive: user.isActive !== false, // Default to true if undefined
        address: user.address ? {
          city: user.address.city || '',
          state: user.address.state || '',
          pincode: user.address.pincode || '',
          street: user.address.street || '',
          landmark: user.address.landmark || ''
        } : null,
        bookingsCount: user.bookings?.length || 0,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: user.updatedAt?.toISOString() || new Date().toISOString()
      }));
      
      // Return formatted response with enhanced pagination info
      return {
        users: formattedUsers,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          hasMore
        }
      };
    } catch (error) {
      // Enhanced error logging with context
      console.error('Error fetching users:', error);
      
      // More descriptive error message
      if (error instanceof Error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
      
      throw new Error('Failed to fetch users due to an unknown error');
    }
  }

export async function getServiceProviders(
  page = 1, 
  limit = 10, 
  search = "", 
  options: { 
    sortBy?: string, 
    filterBy?: string 
  } = {}
) {
  try {
    await dbConnect()
    console.log("Fetching service providers with options:", { page, limit, search, options })
    // Build base query
    const query: any = {};
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.state': { $regex: search, $options: 'i' } }
      ];
    }

    // Convert filterBy to ObjectId if provided
    if (options.filterBy && options.filterBy !== 'all') {
      try {
        query.profession = new Types.ObjectId(options.filterBy);
        console.log("Filter query:", query);
      } catch (err) {
        console.error("Invalid ObjectId for profession filter:", options.filterBy);
      }
    }

    // Determine sort options
    let sort: any = { createdAt: -1 }; // default sort
    switch (options.sortBy) {
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'experience':
        sort = { experience: -1 };
        break;
      case 'reviews':
        sort = { totalReviews: -1 };
        break;
      case 'bookings':
        sort = { totalBookings: -1 };
        break;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Log the complete pipeline for debugging
    const pipeline = [
      { $match: query },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'services',
          localField: 'profession',
          foreignField: '_id',
          as: 'professionDetails'
        }
      },
      {
        $addFields: {
          profession: { $arrayElemAt: ['$professionDetails.name', 0] }
        }
      },
      {
        $project: {
          professionDetails: 0,
          password: 0,
          __v: 0
        }
      }
    ];

    console.log("Aggregation pipeline:", JSON.stringify(pipeline, null, 2));

    // Execute aggregation with error catching
    const providers = await ServiceProvider.aggregate(pipeline).catch(err => {
      console.error("Aggregation error:", err);
      return [];
    });
    
    console.log("Found providers:", providers.length);
    
    const totalCount = await ServiceProvider.countDocuments(query);
    
    const hasMore = skip + providers.length < totalCount;
    
    // Format the response with unique entries
    const formattedProviders = providers.map(provider => ({
      _id: provider._id.toString(),
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      profileImage: provider.profileImage,
      profession: provider.profession || '',
      experience: provider.experience,
      address: provider.address,
      isAvailable: provider.availability?.isAvailable || false,
      isVerified: provider.isVerified,
      isActive: provider.isActive,
      rating: provider.rating,
      totalReviews: provider.totalReviews,
      totalBookings: provider.totalBookings,
      completedBookings: provider.completedBookings,
      createdAt: provider.createdAt.toISOString()
    }));
    
    return {
      providers: formattedProviders,
      hasMore
    };

  } catch (error) {
    console.error('Error fetching service providers:', error);
    throw new Error('Failed to fetch service providers');
  }
}

  export async function getServices(page = 1, limit = 10, search = "") {
    try {
     await dbConnect()
      // Build search query
      let query = {};
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'subServices.name': { $regex: search, $options: 'i' } }
          ]
        };
      }
  
      // Count total matching documents for pagination
      const totalCount = await Service.countDocuments(query);
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      const hasMore = skip + limit < totalCount;
      
      // Fetch services
      const services = await Service.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Map MongoDB documents to the expected format
      const formattedServices = services.map(service => ({
        _id: service?._id?.toString(),
        name: service.name,
        slug: service.slug,
        description: service.description,
        icon: service.icon,
        image: service.image,
        isActive: service.isActive,
        subServices: service.subServices.map(sub => ({
          _id: sub._id.toString(),
          name: sub.name,
          description: sub.description || '',
          basePrice: sub.basePrice,
          priceUnit: sub.priceUnit
        })),
        providersCount: service.providers?.length || 0,
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString()
      }));
      
      return {
        services: formattedServices,
        hasMore
      };
    } catch (error) {
      console.error('Error fetching services:', error);
      throw new Error('Failed to fetch services');
    }
  }

export async function getBookings(page = 1, limit = 10, search = "", status?: string) {
    try {
      await dbConnect()
      // Build query
      const query: any = {};
      
      // Add status filter if provided
      if (status && status !== "all") {
        query.status = status;
      }
      
      // Add search filter if provided
      if (search) {
        query.$or = [
          // We need an associated schema to properly match these fields
          // Using best guesses based on the provided information
          { 'user.name': { $regex: search, $options: 'i' } },
          { 'serviceProvider.name': { $regex: search, $options: 'i' } },
          { 'service.name': { $regex: search, $options: 'i' } },
          { 'subServiceName': { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } }
        ];
      }
  
      // Count total matching documents for pagination
      const totalCount = await Booking.countDocuments(query);
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      const hasMore = skip + limit < totalCount;
      
      // Fetch bookings with populated references
      const bookings = await Booking.find(query)
        .populate('user', 'name')
        .populate('serviceProvider', 'name')
        .populate('service', 'name')
        .populate('review')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Map MongoDB documents to the expected format
      const formattedBookings = bookings.map(booking => ({
        _id: booking?._id?.toString(),
        userId: booking.user?._id?.toString(),
        userName: booking.user?.name,
        providerId: booking.serviceProvider?._id?.toString(),
        providerName: booking.serviceProvider?.name,
        serviceId: booking.service?._id?.toString(),
        serviceName: booking.service?.name,
        subServiceName: booking.subServiceName,
        bookingDate: booking.bookingDate?.toISOString(),
        address: booking.address || {
          city: '',
          state: '',
          pincode: ''
        },
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        estimatedPrice: booking.estimatedPrice,
        finalPrice: booking.finalPrice,
        isReviewed: booking.isReviewed || false,
        reviewId: booking.review?._id?.toString(),
        createdAt: booking.createdAt?.toISOString()
      }));
      
      return {
        bookings: formattedBookings,
        hasMore
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

export async function getReviews(page = 1, limit = 10, search = "", minRating?: number) {
    try {
      await dbConnect()
      // Convert params to appropriate types
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Math.min(100, Number(limit))); // Cap at 100 for performance
      const minRatingNum = minRating ? Number(minRating) : undefined;
      
      // Build base query
      const query: any = {};
      
      // Add rating filter if provided and valid
      if (minRatingNum !== undefined && !isNaN(minRatingNum)) {
        query.rating = { $gte: minRatingNum };
      }
      
      // Add search filter if provided
      if (search && typeof search === 'string' && search.trim()) {
        // Search across referenced document fields requires proper population
        query.$or = [
          { comment: { $regex: search, $options: 'i' } }// Direct field in review schema
        ];
      }
  
      // Pagination calculations
      const skip = (pageNum - 1) * limitNum;
      
      // Execute count query and data query in parallel for better performance
      const [totalCount, reviews] = await Promise.all([
        Review.countDocuments(query),
        Review.find(query)
          .populate('user', 'name')
          .populate('serviceProvider', 'name')
          .populate('service', 'name')
          .populate('booking', 'bookingDate')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean()
      ]);
      
      // Check if there are more pages
      const hasMore = skip + reviews.length < totalCount;
      
      // Map MongoDB documents to the expected format with proper error handling
      const formattedReviews = reviews.map(review => ({
        _id: review._id?.toString() || '',
        userId: review.user?._id?.toString() || '',
        userName: review.user?.name || '',
        providerId: review.serviceProvider?._id?.toString() || '',
        providerName: review.serviceProvider?.name || '',
        bookingId: review.booking?._id?.toString() || '',
        bookingDate: review.booking?.bookingDate?.toISOString() || '',
        serviceId: review.service?._id?.toString() || '',
        serviceName: review.service?.name || '',
        rating: review.rating || 0,
        comment: review.comment || '',
        createdAt: review.createdAt?.toISOString() || new Date().toISOString()
      }));
      
      // Return formatted response
      return {
        reviews: formattedReviews,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          hasMore
        }
      };
    } catch (error) {
      // Enhanced error logging and handling
      console.error('Error fetching reviews:', error);
      
      // Provide more context in the error message
      if (error instanceof Error) {
        throw new Error(`Failed to fetch reviews: ${error.message}`);
      }
      
      throw new Error('Failed to fetch reviews due to an unknown error');
    }
  }

// Get real dashboard statistics
export async function getDashboardStats() {
  try {
    await dbConnect()
    
    // Total counts
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    
    const totalProviders = await ServiceProvider.countDocuments()
    const activeProviders = await ServiceProvider.countDocuments({ isActive: true })
    const verifiedProviders = await ServiceProvider.countDocuments({ isVerified: true })
    
    const totalServices = await Service.countDocuments()
    const activeServices = await Service.countDocuments({ isActive: true })
    const totalSubServices = await Service.aggregate([
      { $unwind: "$subServices" },
      { $count: "total" }
    ]).then(result => result[0]?.total || 0)

    const totalBookings = await Booking.countDocuments()
    const pendingBookings = await Booking.countDocuments({ status: "pending" })
    const completedBookings = await Booking.countDocuments({ status: "completed" })
    const cancelledBookings = await Booking.countDocuments({ 
      status: { $in: ["cancelled", "no-show"] } 
    })

    // Financial stats
    const financialStats = await Booking.aggregate([
      { $match: { status: "completed" } },
      { 
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalPrice" },
          totalOrders: { $sum: 1 }
        }
      }
    ]).then(result => result[0] || { totalRevenue: 0, totalOrders: 0 })

    // Reviews stats
    const reviewStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]).then(result => result[0] || { averageRating: 0, totalReviews: 0 })

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('serviceProvider', 'name')
      .populate('service', 'name')
      .lean()

    // Recent reviews
    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('serviceProvider', 'name')
      .populate('service', 'name')
      .lean()

    // Service distribution
    const serviceDistribution = await Service.aggregate([
      {
        $project: {
          name: 1,
          subServicesCount: { $size: "$subServices" },
          providersCount: { $size: "$providers" }
        }
      }
    ])

    // Monthly booking trends (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]).then(results => {
      // Convert to required format
      return results.map(item => ({
        month: new Date(item._id.year, item._id.month - 1)
          .toLocaleString('default', { month: 'short' }),
        count: item.count
      }))
    })

    return {
      counts: {
        totalUsers,
        activeUsers,
        totalProviders,
        activeProviders,
        verifiedProviders,
        totalServices,
        activeServices,
        totalSubServices,
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
      },
      financial: {
        totalRevenue: financialStats.totalRevenue,
        averageOrderValue: financialStats.totalOrders > 0 
          ? financialStats.totalRevenue / financialStats.totalOrders 
          : 0
      },
      satisfaction: {
        averageRating: reviewStats.averageRating || 0,
        totalReviews: reviewStats.totalReviews
      },
      recent: {
        bookings: recentBookings.map(booking => ({
          ...booking,
          userName: booking.user.name,
          providerName: booking.serviceProvider.name,
          serviceName: booking.service.name
        })),
        reviews: recentReviews.map(review => ({
          ...review,
          userName: review.user.name,
          providerName: review.serviceProvider.name,
          serviceName: review.service.name
        }))
      },
      analytics: {
        serviceDistribution,
        monthlyBookings
      }
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw new Error("Failed to fetch dashboard statistics")
  }
}
