"use server"

import { connectDB } from "@/lib/seeder"
import { ServiceProvider, User } from "@/models"
import mongoose from "mongoose"

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
      id: user._id.toString()
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