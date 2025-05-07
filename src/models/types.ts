import { Types } from "mongoose"

export type BookingStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"
export type PaymentStatus = "pending" | "partial" | "completed" | "refunded"
export type PaymentMethod = "cash" | "online" | "wallet"
export type CancelledBy = "user" | "provider" | "admin"
export type PriceUnit = "hour" | "day" | "job"
export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export interface BookingType {
    user: Types.ObjectId, serviceProvider: Types.ObjectId, service: Types.ObjectId,
    subService?: { name?: string, price?: number, priceUnit?: PriceUnit },
    bookingDate: Date, address: { street?: string, city: string, state: string, pincode: string, landmark?: string, coordinates?: [number, number] },
    description: string, status?: BookingStatus, paymentStatus?: PaymentStatus, paymentMethod?: PaymentMethod,
    estimatedPrice: number, finalPrice?: number, serviceStartTime?: Date, serviceEndTime?: Date, totalHours?: number,
    cancellationReason?: string, cancelledBy?: CancelledBy, isReviewed?: boolean, review?: Types.ObjectId,
    createdAt?: Date, updatedAt?: Date
}

export interface ReviewType {
    user: Types.ObjectId, serviceProvider: Types.ObjectId, booking: Types.ObjectId, service?: Types.ObjectId,
    rating: number, comment: string, createdAt?: Date, updatedAt?: Date
}

export interface ServiceProviderType {
    name: string, email: string, password: string, phone: string, profileImage?: string,
    profession: Types.ObjectId | ServiceType, services: { service: Types.ObjectId | ServiceType, price: number, priceUnit?: PriceUnit }[],
    experience: number, address: { street?: string, city: string, state: string, pincode: string, landmark?: string },
    coordinates?: [number, number], availability?: { isAvailable?: boolean, workingDays?: WeekDay[], workingHours?: { start?: string, end?: string } },
    professionalCertificates?: string[], isVerified?: boolean, isActive?: boolean,
    rating?: number, totalReviews?: number, totalBookings?: number, completedBookings?: number,
    bookings?: Types.ObjectId[] | BookingType[], reviews?: Types.ObjectId[] | ReviewType[],
    bankDetails?: { accountHolderName?: string, accountNumber?: string, ifscCode?: string, bankName?: string, branch?: string },
    createdAt?: Date, updatedAt?: Date
}

export interface SubServiceType {
    name: string, description?: string, basePrice: number, priceUnit?: PriceUnit
}

export interface ServiceType {
    name: string, slug: string, description: string, icon?: string, image?: string,
    isActive?: boolean, subServices?: SubServiceType[]
}
