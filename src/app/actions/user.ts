"use server"

import { connectDB } from "@/lib/seeder"
import { ServiceProvider, User } from "@/models"
import mongoose from "mongoose"

export async function getUser({ email, role, populate = false }: { email: string; role: string; populate?: boolean }) {
  await connectDB();

  const Model:any = role === "serviceProvider" ? ServiceProvider : User;
  let query:any = Model.findOne({ email });
  
  if (populate) {
    query = await query.populate('profession', 'name');
  }


  if (!query) {
    return null;
  }

  // Serialize the document
  return JSON.parse(JSON.stringify(query));
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