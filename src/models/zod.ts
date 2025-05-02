import { z } from "zod"

// Validation schemas
export const serviceProviderRegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Please enter a valid phone number" }),
  profession: z.string({ required_error: "Please select a profession" }),
  experience: z.coerce.number().min(0, { message: "Experience cannot be negative" }),
  street: z.string().optional(),
  city: z.string({ required_error: "City is required" }),
  state: z.string({ required_error: "State is required" }),
  pincode: z.string({ required_error: "Pincode is required" }),
  landmark: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  bankName: z.string().optional(),
  branch: z.string().optional(),
  isAvailable: z.boolean().default(true),
  workingDays: z.array(z.string()).optional(),
  workingHoursStart: z.string().optional(),
  workingHoursEnd: z.string().optional(),
  profileImage: z.string().optional(),
})

export const userRegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Please enter a valid phone number" }),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  landmark: z.string().optional(),
  profileImage: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
})

export const phoneLoginSchema = z.object({
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Please enter a valid phone number" }),
})

export const otpVerifySchema = z.object({
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Please enter a valid phone number" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
})
