export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  role: string;
  isActive: boolean;
  address?: {
    street?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
}

export interface ServiceProvider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  profession: string;
  experience: number;
  address: {
    street?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  completedBookings: number;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  subServices: SubService[];
}

export interface SubService {
  _id: string;
  name: string;
  description?: string;
  basePrice: number;
  priceUnit: "hour" | "day" | "job";
}

export interface Booking {
  _id: string;
  user: User;
  serviceProvider: ServiceProvider;
  service: Service;
  subService: {
    name: string;
    price: number;
    priceUnit: "hour" | "day" | "job";
  };
  bookingDate: string;
  address: {
    street?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    coordinates?: number[];
  };
  description: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  paymentStatus: "pending" | "partial" | "completed" | "refunded";
  paymentMethod: "cash" | "online" | "wallet";
  estimatedPrice: number;
  finalPrice?: number;
  serviceStartTime?: string;
  serviceEndTime?: string;
  totalHours?: number;
  cancellationReason?: string;
  cancelledBy?: "user" | "provider" | "admin";
  isReviewed: boolean;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: User;
  serviceProvider: ServiceProvider;
  service: Service;
  booking: Booking;
  rating: number;
  comment: string;
  createdAt: string;
}
