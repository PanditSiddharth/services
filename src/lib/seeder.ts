"use server"
import mongoose from 'mongoose';
import User from "@/models/user";
import ServiceProvider from "@/models/service-provider";
import Service from "@/models/service";
import Booking from "@/models/booking";
import Review from "@/models/review";

// import { User, ServiceProvider, Service, Booking, Review } from "@/models/index";
import { 
  BookingType, 
  ServiceProviderType, 
  ServiceType, 
  SubServiceType,
  ReviewType
} from "@/models/types";

import connectDB from './db-connect';

// Seed users
async function seedUsers(count = 100) {
  try {
    await connectDB();
    // Delete existing users
    await User.deleteMany({});
    console.log('Deleted existing users');

    // Generate user data
    const users:any = [];
    for (let i = 0; i < count; i++) {
      users.push({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        isActive: Math.random() > 0.2,
        role: "user",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      });
    }

    // Insert users
    const result = await User.insertMany(users);
    console.log(`${result.length} users seeded`);
    return (JSON.stringify(result));
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

// Seed services
async function seedServices() {
  try {
    // Delete existing services
    await Service.deleteMany({});
    console.log('Deleted existing services');

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
    ];

    // Generate service data
    const services: ServiceType[] = [];
    
    for (let i = 0; i < serviceTypes.length; i++) {
      const serviceType = serviceTypes[i];
      const subServicesCount = Math.floor(Math.random() * 5) + 2;
      
      const subServices: SubServiceType[] = [];
      for (let j = 0; j < subServicesCount; j++) {
        subServices.push({
          name: `${serviceType.name} Service ${j + 1}`,
          description: `Description for ${serviceType.name} Service ${j + 1}`,
          basePrice: Math.floor(Math.random() * 1000) + 200,
          priceUnit: ["hour", "day", "job"][Math.floor(Math.random() * 3)] as "hour" | "day" | "job",
        });
      }

      services.push({
        name: serviceType.name,
        slug: serviceType.name.toLowerCase().replace(/\s+/g, "-"),
        description: serviceType.description,
        icon: serviceType.icon,
        image: "/placeholder.svg",
        isActive: Math.random() > 0.2,
        subServices: subServices,
      });
    }

    // Insert services
    const result = await Service.insertMany(services);
    console.log(`${result.length} services seeded`);
    return JSON.stringify(result);
  } catch (error) {
    console.error('Error seeding services:', error);
    throw error;
  }
}

// Seed service providers
async function seedServiceProviders(count = 100) {
  try {
    // Delete existing providers
    await ServiceProvider.deleteMany({});
    console.log('Deleted existing service providers');

    // Get services for reference
    const services = await Service.find().lean();
    if (!services.length) {
      throw new Error("Services must be seeded before providers");
    }

    const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];
    const states = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Generate provider data
    const providers:any = [];
    for (let i = 0; i < count; i++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const servicesList:any = [];
      
      // Assign 1-3 subservices to this provider
      const numServices = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numServices && j < service.subServices.length; j++) {
        const subService = service.subServices[j];
        servicesList.push({
          service: service._id,
          price: subService.basePrice + Math.floor(Math.random() * 200),
          priceUnit: subService.priceUnit
        });
      }

      // Generate working days (at least 3 days)
      const numWorkDays = Math.floor(Math.random() * 4) + 3;
      const shuffledDays = [...days].sort(() => 0.5 - Math.random());
      const workingDays = shuffledDays.slice(0, numWorkDays);

      providers.push({
        name: `Provider ${i + 1}`,
        email: `provider${i + 1}@example.com`,
        password: `password${i + 1}`, // In a real app, this would be hashed
        phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        profileImage: "/placeholder.svg",
        profession: service._id,
        services: servicesList,
        experience: Math.floor(Math.random() * 10) + 1,
        address: {
          city: cities[Math.floor(Math.random() * cities.length)],
          state: states[Math.floor(Math.random() * states.length)],
          pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
        },
        availability: {
          isAvailable: Math.random() > 0.3,
          workingDays: workingDays,
          workingHours: {
            start: `0${Math.floor(Math.random() * 3) + 8}:00`, // 08:00 to 10:00
            end: `${Math.floor(Math.random() * 4) + 17}:00`,   // 17:00 to 20:00
          }
        },
        isVerified: Math.random() > 0.4,
        isActive: Math.random() > 0.2,
        rating: Math.floor(Math.random() * 50 + 1) / 10,
        totalReviews: Math.floor(Math.random() * 100),
        totalBookings: Math.floor(Math.random() * 200),
        completedBookings: Math.floor(Math.random() * 150),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
        bankDetails: {
          accountHolderName: `Provider ${i + 1}`,
          accountNumber: `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
          ifscCode: `BANK${Math.floor(1000 + Math.random() * 9000)}`,
          bankName: ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Punjab National Bank"][Math.floor(Math.random() * 5)],
          branch: ["Main Branch", "City Branch", "Downtown Branch", "Central Branch", "Regional Branch"][Math.floor(Math.random() * 5)]
        },
      });
    }

    // Insert providers
    const result = await ServiceProvider.insertMany(providers);
    
    // Update service model with providers
    for (const provider of result) {
      await Service.findByIdAndUpdate(
        provider.profession, 
        { $push: { providers: provider._id } }
      );
    }
    
    console.log(`${result.length} service providers seeded`);
    return JSON.stringify(result);
  } catch (error) {
    console.error('Error seeding service providers:', error);
    throw error;
  }
}

// Seed bookings
async function seedBookings(count = 200) {
  try {
    // First get the IDs of existing entities
    const users = await User.find({}, '_id name').lean();
    const providers = await ServiceProvider.find({}, '_id name profession services').lean();
    const services = await Service.find({}, '_id name subServices').lean();
    
    if (!users.length || !providers.length || !services.length) {
      throw new Error('Need to seed users, providers, and services before bookings');
    }

    // Delete existing bookings
    await Booking.deleteMany({});
    console.log('Deleted existing bookings');

    const statuses = ["pending", "confirmed", "in-progress", "completed", "cancelled", "no-show"];
    const paymentStatuses = ["pending", "partial", "completed", "refunded"];
    const paymentMethods = ["cash", "online", "wallet"];
    const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];
    const states = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal"];

    // Generate booking data
    const bookings:any = [];
    for (let i = 0; i < count; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const provider = providers[Math.floor(Math.random() * providers.length)];
      
      // Find a service that this provider offers
      let service, subService;
      
      // Get the service from provider's profession
      const providerService = services.find((s:any) => s._id.toString() === provider.profession.toString());
      
      if (providerService && providerService.subServices && providerService.subServices.length > 0) {
        service = providerService;
        subService = service.subServices[Math.floor(Math.random() * service.subServices.length)];
      } else {
        // Fallback to a random service if provider's profession not found
        service = services[Math.floor(Math.random() * services.length)];
        subService = service.subServices[Math.floor(Math.random() * service.subServices.length)];
      }
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const estimatedPrice = subService.basePrice + Math.floor(Math.random() * 500);
      const bookingDate = new Date(Date.now() + Math.floor(Math.random() * 1000000000));
      
      // For completed bookings, add service times and final price
      let serviceStartTime, serviceEndTime, totalHours, finalPrice;
      if (status === "completed") {
        serviceStartTime = new Date(bookingDate);
        totalHours = Math.floor(Math.random() * 5) + 1;
        serviceEndTime = new Date(serviceStartTime.getTime() + (totalHours * 60 * 60 * 1000));
        finalPrice = estimatedPrice + Math.floor(Math.random() * 500) - 250; // Could be more or less than estimated
      }
      
      // For cancelled bookings, add reason and cancelled by
      let cancellationReason, cancelledBy;
      if (status === "cancelled") {
        cancellationReason = [
          "Schedule conflict", 
          "Found another service", 
          "Price too high", 
          "Service not needed anymore",
          "Provider unavailable"
        ][Math.floor(Math.random() * 5)];
        
        cancelledBy = ["user", "provider", "admin"][Math.floor(Math.random() * 3)];
      }

      bookings.push({
        user: user._id,
        serviceProvider: provider._id,
        service: service._id,
        subService: {
          name: subService.name,
          price: subService.basePrice,
          priceUnit: subService.priceUnit
        },
        bookingDate,
        address: {
          city: cities[Math.floor(Math.random() * cities.length)],
          state: states[Math.floor(Math.random() * states.length)],
          pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
          landmark: Math.random() > 0.5 ? `Near ${["Hospital", "School", "Mall", "Park", "Temple"][Math.floor(Math.random() * 5)]}` : undefined
        },
        description: `Need help with ${subService.name}. Please bring all necessary tools and materials.`,
        status,
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        estimatedPrice,
        finalPrice,
        serviceStartTime,
        serviceEndTime,
        totalHours,
        cancellationReason,
        cancelledBy,
        isReviewed: status === "completed" ? Math.random() > 0.3 : false,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      });
    }

    // Insert bookings
    const result = await Booking.insertMany(bookings);
    
    // Update user and provider booking lists
    for (const booking of result) {
      await User.findByIdAndUpdate(
        booking.user,
        { $push: { bookings: booking._id } }
      );
      
      await ServiceProvider.findByIdAndUpdate(
        booking.serviceProvider,
        { 
          $push: { bookings: booking._id },
          $inc: { 
            totalBookings: 1,
            ...(booking.status === "completed" ? { completedBookings: 1 } : {})
          }
        }
      );
    }
    
    console.log(`${result.length} bookings seeded`);
    return JSON.stringify(result);
  } catch (error) {
    console.error('Error seeding bookings:', error);
    throw error;
  }
}

// Seed reviews
async function seedReviews(count = 150) {
  try {
    // Get completed bookings to attach reviews to
    const completedBookings = await Booking.find({ 
      status: 'completed',
      isReviewed: false 
    })
    .populate('user', 'name')
    .populate('serviceProvider', 'name')
    .populate('service', 'name')
    .lean();
    
    if (completedBookings.length === 0) {
      throw new Error('Need completed bookings before seeding reviews');
    }

    // Delete existing reviews
    await Review.deleteMany({});
    console.log('Deleted existing reviews');

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
    ];

    // Generate review data
    const reviews:any = [];
    // Only create up to the number of completed bookings or requested count, whichever is smaller
    const actualCount = Math.min(count, completedBookings.length);
    
    for (let i = 0; i < actualCount; i++) {
      const booking = completedBookings[i % completedBookings.length];
      
      reviews.push({
        user: booking.user._id,
        serviceProvider: booking.serviceProvider._id,
        booking: booking._id,
        service: booking.service._id,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: comments[Math.floor(Math.random() * comments.length)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      });
    }

    // Insert reviews
    const result = await Review.insertMany(reviews);
    console.log(`${result.length} reviews seeded`);

    // Update service provider ratings - this should be handled by the post-save hook in the review model
    // but we'll do it here too for completeness
    const providers = await ServiceProvider.find({}, '_id').lean();

    for (const provider of providers) {
      const providerReviews = await Review.find({ serviceProvider: provider._id });
      if (providerReviews.length > 0) {
        const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / providerReviews.length;
        
        await ServiceProvider.findByIdAndUpdate(provider._id, {
          rating: parseFloat(averageRating.toFixed(1)),
          totalReviews: providerReviews.length
        });
      }
    }

    return JSON.stringify(result);
  } catch (error) {
    console.error('Error seeding reviews:', error);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    await connectDB();

    // Seed all collections in the correct order
    await seedUsers();
    await seedServices();
    await seedServiceProviders();
    await seedBookings();
    await seedReviews();

    console.log('Database seeding completed successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

export {
  connectDB,
  seedUsers,
  seedServiceProviders,
  seedServices,
  seedBookings,
  seedReviews,
  seedDatabase
};