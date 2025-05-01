// app/actions/auth.ts
"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/db-connect"
import User from "@/modals/user"
import ServiceProvider from "@/modals/service-provider"

// JWT secret - should be in .env file in production
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Token expiration time
const TOKEN_EXPIRY = "7d" // 7 days

// Zod schema for user signup validation
const UserSignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please provide a valid phone number"),
  email: z.string().email("Invalid email address"),
})

// Zod schema for service provider signup validation
const ServiceProviderSignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please provide a valid phone number"),
  profession: z.string().min(1, "Profession is required"),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
})

// Zod schema for login validation
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  userType: z.enum(["user", "provider"]).default("provider"),
})

// Generate JWT token
const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

// Set token in cookies
const setAuthCookie = (token: string) => {
  cookies().then((value)=> 
  value.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
)}

// Clear auth cookie
const clearAuthCookie = () => {
  cookies().then((value)=> value.delete("auth_token"))
}

// User signup function
export async function userSignup(formData: FormData) {
  const validatedFields = UserSignupSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed",
    }
  }

  try {
    await dbConnect()

    const { name, email, phone } = validatedFields.data

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return {
        errors: { email: ["User with this email already exists"] },
        message: "User already exists",
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
    })

    // Generate token
    const token = generateToken({
      id: user._id,
      role: "user",
    })

    // Set token in cookies
    setAuthCookie(token)

    return {
      success: true,
      message: "User created successfully",
    }
  } catch (error: any) {
    console.error("Error creating user:", error)
    return {
      message: error.message || "Failed to create user",
    }
  }
}

// Service provider signup function
export async function providerSignup(formData: FormData) {
  const validatedFields = ServiceProviderSignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    profession: formData.get("profession"),
    experience: formData.get("experience"),
    city: formData.get("city"),
    state: formData.get("state"),
    pincode: formData.get("pincode"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed",
    }
  }

  try {
    await dbConnect()

    const { name, email, password, phone, profession, experience, city, state, pincode } = validatedFields.data

    // Check if service provider already exists
    const existingProvider = await ServiceProvider.findOne({ email })
    if (existingProvider) {
      return {
        errors: { email: ["Provider with this email already exists"] },
        message: "Provider already exists",
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new service provider
    const provider = await ServiceProvider.create({
      name,
      email,
      password: hashedPassword,
      phone,
      profession,
      experience,
      address: {
        city,
        state,
        pincode,
      },
    })

    // Generate token
    const token = generateToken({
      id: provider._id,
      role: "provider",
    })

    // Set token in cookies
    setAuthCookie(token)

    return {
      success: true,
      message: "Service provider created successfully",
    }
  } catch (error: any) {
    console.error("Error creating service provider:", error)
    return {
      message: error.message || "Failed to create service provider",
    }
  }
}

// Login function
export async function login(formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    userType: formData.get("userType"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed",
    }
  }

  try {
    await dbConnect()

    const { email, password, userType } = validatedFields.data

    if (userType === "user") {
      // User login
      // Since users don't have passwords in your schema, we'll authenticate by email only
      const user = await User.findOne({ email })
      if (!user) {
        return {
          errors: { email: ["User not found"] },
          message: "Invalid credentials",
        }
      }

      // Generate token
      const token = generateToken({
        id: user._id,
        role: "user",
      })

      // Set token in cookies
      setAuthCookie(token)

      return {
        success: true,
        message: "Login successful",
        redirectTo: "/user/dashboard",
      }
    } else {
      // Service provider login
      const provider = await ServiceProvider.findOne({ email }).select("+password")
      if (!provider) {
        return {
          errors: { email: ["Service provider not found"] },
          message: "Invalid credentials",
        }
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, provider.password)
      if (!isMatch) {
        return {
          errors: { password: ["Invalid password"] },
          message: "Invalid credentials",
        }
      }

      // Generate token
      const token = generateToken({
        id: provider._id,
        role: "provider",
      })

      // Set token in cookies
      setAuthCookie(token)

      return {
        success: true,
        message: "Login successful",
        redirectTo: "/provider/dashboard",
      }
    }
  } catch (error: any) {
    console.error("Error logging in:", error)
    return {
      message: error.message || "Failed to login",
    }
  }
}

// Logout function
export async function logout() {
  clearAuthCookie()
  redirect("/login")
}

// Verify token and get current user
export async function getCurrentUser() {
  try {
 const token = await cookies().then((value)=> value.get("auth_token")?.value)

    if (!token) {
      return null
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload

    if (!decoded || !decoded.id) {
      return null
    }

    await dbConnect()

    if (decoded.role === "user") {
      const user = await User.findById(decoded.id)
      if (!user) return null
      return {
        ...JSON.parse(JSON.stringify(user)),
        role: "user",
      }
    } else {
      const provider = await ServiceProvider.findById(decoded.id)
      if (!provider) return null
      return {
        ...JSON.parse(JSON.stringify(provider)),
        role: "provider",
      }
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Auth middleware
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

// Role-based middleware
export async function requireRole(allowedRoles: string[]) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}