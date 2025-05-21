import { z } from "zod"

export const UserSchema = z.object({
  _id: z.string().optional(), // Add this line
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  landmark: z.string().optional(),
  profileImage: z.string().optional(),
})

// ...existing code...