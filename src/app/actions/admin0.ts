"use server"

// Types for our data
export type User = {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
  lastLogin?: string
  status: "active" | "inactive"
}

export type ServiceProvider = {
  id: string
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
  id: string
  name: string
  slug: string
  description: string
  icon: string
  image: string
  isActive: boolean
  subServices: {
    id: string
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
  id: string
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
  _id: string
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

// Mock data generator for development
function generateMockUsers(count: number, offset = 0): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${offset + i + 1}`,
    name: `User ${offset + i + 1}`,
    email: `user${offset + i + 1}@example.com`,
    phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    lastLogin:
      Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString() : undefined,
    status: Math.random() > 0.2 ? "active" : "inactive",
  }))
}

function generateMockProviders(count: number, offset = 0): ServiceProvider[] {
  const serviceTypes = ["plumber", "electrician", "carpenter", "painter", "gardener", "cleaner"]
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"]
  const states = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal"]

  return Array.from({ length: count }, (_, i) => ({
    id: `provider-${offset + i + 1}`,
    businessName: `Service Provider ${offset + i + 1}`,
    ownerName: `Owner ${offset + i + 1}`,
    email: `provider${offset + i + 1}@example.com`,
    phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
    experience: Math.floor(Math.random() * 10) + 1,
    city: cities[Math.floor(Math.random() * cities.length)],
    state: states[Math.floor(Math.random() * states.length)],
    isAvailable: Math.random() > 0.3,
    isVerified: Math.random() > 0.4,
    rating: Math.floor(Math.random() * 50 + 1) / 10,
    totalReviews: Math.floor(Math.random() * 100),
    totalBookings: Math.floor(Math.random() * 200),
    completedBookings: Math.floor(Math.random() * 150),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    status: Math.random() > 0.7 ? "active" : Math.random() > 0.4 ? "pending" : "suspended",
  }))
}

function generateMockServices(count: number, offset = 0): Service[] {
  const serviceTypes = [
    {
      name: "Plumbing",
      icon: "Droplet",
      description: "Professional plumbing services for your home and office",
    },
    {
      name: "Electrical",
      icon: "Zap",
      description: "Electrical repair and installation services",
    },
    {
      name: "Carpentry",
      icon: "Hammer",
      description: "Custom carpentry and woodworking services",
    },
    {
      name: "Painting",
      icon: "Paintbrush",
      description: "Interior and exterior painting services",
    },
    {
      name: "Gardening",
      icon: "Flower2",
      description: "Professional gardening and landscaping services",
    },
    {
      name: "Cleaning",
      icon: "Sparkles",
      description: "Deep cleaning services for homes and offices",
    },
    {
      name: "Appliance Repair",
      icon: "Wrench",
      description: "Repair services for all home appliances",
    },
    {
      name: "AC Repair",
      icon: "Wind",
      description: "Air conditioner repair and maintenance services",
    },
  ]

  return Array.from({ length: count }, (_, i) => {
    const serviceType = serviceTypes[i % serviceTypes.length]
    const subServicesCount = Math.floor(Math.random() * 5) + 2

    return {
      id: `service-${offset + i + 1}`,
      name: serviceType.name,
      slug: serviceType.name.toLowerCase().replace(/\s+/g, "-"),
      description: serviceType.description,
      icon: serviceType.icon,
      image: "/placeholder.svg",
      isActive: Math.random() > 0.2,
      subServices: Array.from({ length: subServicesCount }, (_, j) => ({
        id: `subservice-${i}-${j}`,
        name: `${serviceType.name} Service ${j + 1}`,
        description: `Description for ${serviceType.name} Service ${j + 1}`,
        basePrice: Math.floor(Math.random() * 1000) + 200,
        priceUnit: ["hour", "day", "job"][Math.floor(Math.random() * 3)] as "hour" | "day" | "job",
      })),
      providersCount: Math.floor(Math.random() * 20) + 5,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    }
  })
}

function generateMockBookings(count: number, offset = 0): Booking[] {
  const statuses: Booking["status"][] = ["pending", "confirmed", "in-progress", "completed", "cancelled", "no-show"]
  const paymentStatuses: Booking["paymentStatus"][] = ["pending", "partial", "completed", "refunded"]
  const paymentMethods: Booking["paymentMethod"][] = ["cash", "online", "wallet"]
  const services = ["Plumbing", "Electrical", "Carpentry", "Painting", "Gardening", "Cleaning"]
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"]
  const states = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal"]

  return Array.from({ length: count }, (_, i) => {
    const service = services[Math.floor(Math.random() * services.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    return {
      id: `booking-${offset + i + 1}`,
      userId: `user-${Math.floor(Math.random() * 50) + 1}`,
      userName: `User ${Math.floor(Math.random() * 50) + 1}`,
      providerId: `provider-${Math.floor(Math.random() * 50) + 1}`,
      providerName: `Provider ${Math.floor(Math.random() * 50) + 1}`,
      serviceId: `service-${Math.floor(Math.random() * 8) + 1}`,
      serviceName: service,
      subServiceName: `${service} Service ${Math.floor(Math.random() * 3) + 1}`,
      bookingDate: new Date(Date.now() + Math.floor(Math.random() * 1000000000)).toISOString(),
      address: {
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
      },
      status,
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      estimatedPrice: Math.floor(Math.random() * 5000) + 500,
      finalPrice: status === "completed" ? Math.floor(Math.random() * 5000) + 500 : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    }
  })
}

function generateMockReviews(count: number, offset = 0): Review[] {
  const services = ["Plumbing", "Electrical", "Carpentry", "Painting", "Gardening", "Cleaning"]
  const comments = [
    "Great service, very professional!",
    "Arrived on time and did an excellent job.",
    "Very satisfied with the work done.",
    "Good service but a bit expensive.",
    "Excellent work, will definitely hire again!",
    "Professional and courteous service.",
    "Did a decent job but could improve on timeliness.",
    "Very knowledgeable and efficient.",
    "Solved the problem quickly and effectively.",
    "Highly recommended for quality work.",
  ]

  return Array.from({ length: count }, (_, i) => {
    const service = services[Math.floor(Math.random() * services.length)]

    return {
      _id: `review-${offset + i + 1}`,
      userId: `user-${Math.floor(Math.random() * 50) + 1}`,
      userName: `User ${Math.floor(Math.random() * 50) + 1}`,
      providerId: `provider-${Math.floor(Math.random() * 50) + 1}`,
      providerName: `Provider ${Math.floor(Math.random() * 50) + 1}`,
      bookingId: `booking-${Math.floor(Math.random() * 100) + 1}`,
      serviceId: `service-${Math.floor(Math.random() * 8) + 1}`,
      serviceName: service,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: comments[Math.floor(Math.random() * comments.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    }
  })
}

// Server actions to fetch paginated data
export async function getUsers(page = 1, limit = 10, search = "") {
  // In a real app, you would fetch from your database
  // For now, we'll use mock data
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const offset = (page - 1) * limit
  let users = generateMockUsers(100, 0)

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase()
    users = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.toLowerCase().includes(searchLower),
    )
  }

  const paginatedUsers = users.slice(offset, offset + limit)
  const hasMore = offset + limit < users.length

  return {
    users: paginatedUsers,
    hasMore,
  }
}

export async function getServiceProviders(page = 1, limit = 10, search = "") {
  // In a real app, you would fetch from your database
  // For now, we'll use mock data
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const offset = (page - 1) * limit
  let providers = generateMockProviders(100, 0)

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase()
    providers = providers.filter(
      (provider) =>
        provider.businessName.toLowerCase().includes(searchLower) ||
        provider.ownerName.toLowerCase().includes(searchLower) ||
        provider.email.toLowerCase().includes(searchLower) ||
        provider.serviceType.toLowerCase().includes(searchLower) ||
        provider.city.toLowerCase().includes(searchLower),
    )
  }

  const paginatedProviders = providers.slice(offset, offset + limit)
  const hasMore = offset + limit < providers.length

  return {
    providers: paginatedProviders,
    hasMore,
  }
}

export async function getServices(page = 1, limit = 10, search = "") {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const offset = (page - 1) * limit
  let services = generateMockServices(20, 0)

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase()
    services = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.subServices.some((sub) => sub.name.toLowerCase().includes(searchLower)),
    )
  }

  const paginatedServices = services.slice(offset, offset + limit)
  const hasMore = offset + limit < services.length

  return {
    services: paginatedServices,
    hasMore,
  }
}

export async function getBookings(page = 1, limit = 10, search = "", status?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const offset = (page - 1) * limit
  let bookings = generateMockBookings(200, 0)

  // Apply status filter if provided
  if (status && status !== "all") {
    bookings = bookings.filter((booking) => booking.status === status)
  }

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase()
    bookings = bookings.filter(
      (booking) =>
        booking.userName.toLowerCase().includes(searchLower) ||
        booking.providerName.toLowerCase().includes(searchLower) ||
        booking.serviceName.toLowerCase().includes(searchLower) ||
        booking.subServiceName.toLowerCase().includes(searchLower) ||
        booking.address.city.toLowerCase().includes(searchLower),
    )
  }

  const paginatedBookings = bookings.slice(offset, offset + limit)
  const hasMore = offset + limit < bookings.length

  return {
    bookings: paginatedBookings,
    hasMore,
  }
}

export async function getReviews(page = 1, limit = 10, search = "", minRating?: number) {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const offset = (page - 1) * limit
  let reviews = generateMockReviews(150, 0)

  // Apply rating filter if provided
  if (minRating) {
    reviews = reviews.filter((review) => review.rating >= minRating)
  }

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase()
    reviews = reviews.filter(
      (review) =>
        review.userName.toLowerCase().includes(searchLower) ||
        review.providerName.toLowerCase().includes(searchLower) ||
        review.serviceName.toLowerCase().includes(searchLower) ||
        review.comment.toLowerCase().includes(searchLower),
    )
  }

  const paginatedReviews = reviews.slice(offset, offset + limit)
  const hasMore = offset + limit < reviews.length

  return {
    reviews: paginatedReviews,
    hasMore,
  }
}

// Get dashboard statistics
export async function getDashboardStats() {
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay

  const users = generateMockUsers(100)
  const providers = generateMockProviders(100)
  const services = generateMockServices(20)
  const bookings = generateMockBookings(200)
  const reviews = generateMockReviews(150)

  // Calculate statistics
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === "active").length

  const totalProviders = providers.length
  const activeProviders = providers.filter((provider) => provider.status === "active").length
  const verifiedProviders = providers.filter((provider) => provider.isVerified).length

  const totalServices = services.length
  const activeServices = services.filter((service) => service.isActive).length
  const totalSubServices = services.reduce((total, service) => total + service.subServices.length, 0)

  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length
  const completedBookings = bookings.filter((booking) => booking.status === "completed").length
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled" || booking.status === "no-show",
  ).length

  const totalRevenue = bookings
    .filter((booking) => booking.status === "completed" && booking.finalPrice)
    .reduce((total, booking) => total + (booking.finalPrice || 0), 0)

  const averageRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length

  // Recent activity
  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const recentReviews = reviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Service distribution
  const serviceDistribution = services.map((service) => ({
    name: service.name,
    subServices: service.subServices.length,
    providers: service.providersCount,
  }))

  // Monthly booking trends (last 6 months)
  const currentDate = new Date()
  const monthlyBookings = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthName = month.toLocaleString("default", { month: "short" })
    const count = Math.floor(Math.random() * 50) + 10 // Mock data
    return { month: monthName, count }
  }).reverse()

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
      totalRevenue,
      averageOrderValue: totalRevenue / completedBookings,
    },
    satisfaction: {
      averageRating,
      totalReviews: reviews.length,
    },
    recent: {
      bookings: recentBookings,
      reviews: recentReviews,
    },
    analytics: {
      serviceDistribution,
      monthlyBookings,
    },
  }
}
