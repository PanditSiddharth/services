import { connectDB } from "@/lib/seeder"
import { ServiceProvider, User } from "@/models"
import mongoose from "mongoose"

export const getUser = async (req: { phone?: string, 
    email?: string,
    role?: string
}) => {
    try {
        await connectDB()

        const Model: typeof mongoose.Model = req?.role === "serviceProvider" ? ServiceProvider : User;
      
        const user = await Model.findOne({
            $or: [{ email: req.email }, { phone: req.phone }],
        }).lean()

        if (!user) {
                return null
            }

            return user
        } catch (error) {
            console.error("Error fetching user:", error)
            return null
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