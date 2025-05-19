"use server"

import { connectDB } from "@/lib/seeder"
import { ServiceProvider, User } from "@/models"
import mongoose from "mongoose"
import { Types } from 'mongoose';
import dbConnect from '@/lib/db-connect';
import { Booking, Review } from '@/models';

export async function getUser({ email, role, populate = false }: { email: string; role: string; populate?: boolean }) {
  try {
    await connectDB();

    const Model = role === "serviceProvider" ? ServiceProvider : User;
    let query = (Model as any).findOne({ email });
    
    if (populate) {
      query = query.populate('profession', 'name');
    }

    // Use lean() to get plain JavaScript object
    const user = await query.lean();

    if (!user) return null;

    // Convert _id to string and clean up the object
    const cleanUser = {
      ...user,
      _id: user._id.toString(),
    };

    // Remove Mongoose-specific fields
    delete cleanUser.__v;
    
    return cleanUser;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

type UserData = {
  _id?: string;
  role: string;
  [key: string]: any;
};

export const createOrUpdateUser = async (userData: UserData) => {
  try {
    await connectDB();
    const { _id, ...rest } = userData;

    const Model: typeof mongoose.Model = userData.role === "serviceProvider" ? ServiceProvider : User;

    rest.updatedAt = new Date(); // optional

    if (_id && mongoose.Types.ObjectId.isValid(_id)) {
      return await Model.findByIdAndUpdate(_id, rest, { new: true });
    } else {
      return await Model.create(rest);
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return null;
  }
};

export async function getUserDashboardStats(userId: string) {
  try {
    await dbConnect();

    const bookingsAggregation = await Booking.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      {
        $facet: {
          stats: [
            {
              $group: {
                _id: null,
                totalBookings: { $sum: 1 },
                completedBookings: {
                  $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                },
                pendingBookings: {
                  $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                },
                cancelledBookings: {
                  $sum: {
                    $cond: [
                      { $in: ["$status", ["cancelled", "no-show"]] },
                      1,
                      0
                    ]
                  }
                }
              }
            }
          ],
          recentBookings: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceDetails"
              }
            },
            {
              $lookup: {
                from: "serviceproviders",
                localField: "serviceProvider",
                foreignField: "_id",
                as: "providerDetails"
              }
            },
            {
              $project: {
                _id: "$_id",
                serviceName: { $arrayElemAt: ["$serviceDetails.name", 0] },
                serviceIcon: { $arrayElemAt: ["$serviceDetails.icon", 0] },
                providerName: { $arrayElemAt: ["$providerDetails.name", 0] },
                providerImage: { 
                  $ifNull: [
                    { $arrayElemAt: ["$providerDetails.profileImage", 0] },
                    "/placeholder.svg"
                  ]
                },
                status: 1,
                bookingDate: 1,
                estimatedPrice: 1,
                createdAt: 1
              }
            }
          ]
        }
      }
    ]);

    const reviewsAggregation = await Review.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      {
        $facet: {
          stats: [
            {
              $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                avgRating: { $avg: "$rating" }
              }
            }
          ],
          recentReviews: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "serviceDetails"
              }
            },
            {
              $lookup: {
                from: "serviceproviders",
                localField: "serviceProvider",
                foreignField: "_id",
                as: "providerDetails"
              }
            },
            {
              $project: {
                _id: "$_id",
                serviceName: { $arrayElemAt: ["$serviceDetails.name", 0] },
                serviceIcon: { $arrayElemAt: ["$serviceDetails.icon", 0] },
                providerName: { $arrayElemAt: ["$providerDetails.name", 0] },
                providerImage: { 
                  $ifNull: [
                    { $arrayElemAt: ["$providerDetails.profileImage", 0] },
                    "/placeholder.svg"
                  ]
                },
                rating: 1,
                comment: 1,
                createdAt: 1
              }
            }
          ]
        }
      }
    ]);

    const bookingStats = bookingsAggregation[0]?.stats[0] || {
      totalBookings: 0,
      completedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0
    };

    const reviewStats = reviewsAggregation[0]?.stats[0] || {
      totalReviews: 0,
      avgRating: 0
    };

    return {
      ...bookingStats,
      avgRating: reviewStats.avgRating || 0,
      totalReviews: reviewStats.totalReviews || 0,
      recentBookings: bookingsAggregation[0]?.recentBookings || [],
      recentReviews: reviewsAggregation[0]?.recentReviews || []
    };
  } catch (error) {
    console.error("Error fetching user dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

export async function updateUserProfile(data: {
  _id: string
  name: string
  email: string
  phone?: string
  profileImage?: string
  address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
  }
}) {
  try {
    await dbConnect()

    const { _id, ...updateData } = data
    
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          name: updateData.name,
          phone: updateData.phone,
          profileImage: updateData.profileImage,
          address: updateData.address,
          updatedAt: new Date(),
        },
      },
      { new: true }
    )

    if (!updatedUser) {
      throw new Error("User not found")
    }

    return updatedUser
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update profile")
  }
}