"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import {User, ServiceProvider} from "@/models/index"
import dbConnect from "@/lib/db-connect"
import { loginSchema, otpVerifySchema, phoneLoginSchema, serviceProviderRegisterSchema, userRegisterSchema } from "@/models/zod"
// import { connect } from "http2"

// Environment variables (you would need to set these in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"


/**
 * Register a new service provider
 */
export async function registerServiceProvider(formData: FormData) {
  try {
    // Connect to the database
    await dbConnect()

    // Parse and validate form data
    const rawData = Object.fromEntries(formData.entries())

    // Handle working days array
    const workingDays:any[] = []
    for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]) {
      if (formData.get(day) === "on") {
        workingDays.push(day)
      }
    }

    const data = {
      ...rawData,
      workingDays,
      isAvailable: formData.get("isAvailable") === "on",
    }

    const validatedData = serviceProviderRegisterSchema.parse(data)

    // Check if email already exists
    const existingProvider = await ServiceProvider.findOne({ email: validatedData.email })
    if (existingProvider) {
      return { success: false, message: "Email already registered" }
    }

    // Check if phone already exists
    const existingProviderByPhone = await ServiceProvider.findOne({ phone: validatedData.phone })
    if (existingProviderByPhone) {
      return { success: false, message: "Phone number already registered" }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(validatedData.password, salt)

    // Create new service provider
    const newServiceProvider = new ServiceProvider({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      phone: validatedData.phone,
      profession: validatedData.profession,
      experience: validatedData.experience,
      address: {
        street: validatedData.street,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        landmark: validatedData.landmark,
      },
      availability: {
        isAvailable: validatedData.isAvailable,
        workingDays: validatedData.workingDays,
        workingHours: {
          start: validatedData.workingHoursStart,
          end: validatedData.workingHoursEnd,
        },
      },
      bankDetails: {
        accountHolderName: validatedData.accountHolderName,
        accountNumber: validatedData.accountNumber,
        ifscCode: validatedData.ifscCode,
        bankName: validatedData.bankName,
        branch: validatedData.branch,
      },
      profileImage: validatedData.profileImage || "/placeholder.svg",
    })

    await newServiceProvider.save()

    return { success: true, message: "Registration successful" }
  } catch (error) {
    console.error("Service provider registration error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation error", errors: error.errors }
    }
    return { success: false, message: "Registration failed. Please try again." }
  }
}

/**
 * Register a new user
 */
export async function registerUser(formData: FormData) {
  try {
    // Connect to the database
    await dbConnect()

    // Parse and validate form data
    const data = Object.fromEntries(formData.entries())
    const validatedData = userRegisterSchema.parse(data)

    // Check if phone already exists
    const existingUser = await User.findOne({ phone: validatedData.phone })
    if (existingUser) {
      return { success: false, message: "Phone number already registered" }
    }

    // Check if email already exists (if provided)
    if (validatedData.email) {
      const existingUserByEmail = await User.findOne({ email: validatedData.email })
      if (existingUserByEmail) {
        return { success: false, message: "Email already registered" }
      }
    }

    // Create new user
    const newUser = new User({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      address: {
        street: validatedData.street,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        landmark: validatedData.landmark,
      },
      profileImage: validatedData.profileImage || "/placeholder.svg",
    })

    await newUser.save()

    return { success: true, message: "Registration successful" }
  } catch (error) {
    console.error("User registration error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation error", errors: error.errors }
    }
    return { success: false, message: "Registration failed. Please try again." }
  }
}

/**
 * Login a service provider with email and password
 */
export async function loginServiceProvider(formData: FormData) {
  try {
    // Connect to the database
    await dbConnect()

    // Parse and validate form data
    const data = Object.fromEntries(formData.entries())
    const validatedData = loginSchema.parse(data)

    // Find service provider by email
    const serviceProvider = await ServiceProvider.findOne({ email: validatedData.email }).select("+password")
    if (!serviceProvider) {
      return { success: false, message: "Invalid email or password" }
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(validatedData.password, serviceProvider.password)
    if (!isPasswordCorrect) {
      return { success: false, message: "Invalid email or password" }
    }

    // Create JWT token
    const token = jwt.sign({ id: serviceProvider._id, role: "service-provider" }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    // Set cookie
    const cookieStore = cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: validatedData.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
      path: "/",
    })

    return { success: true, message: "Login successful" }
  } catch (error) {
    console.error("Service provider login error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation error", errors: error.errors }
    }
    return { success: false, message: "Login failed. Please try again." }
  }
}

/**
 * Login a user with email and password
 */
export async function loginUser(formData: FormData) {
  try {
    // Connect to the database
    await dbConnect()

    // Parse and validate form data
    const data = Object.fromEntries(formData.entries())
    const validatedData = loginSchema.parse(data)

    // Find user by email
    const user = await User.findOne({ email: validatedData.email })
    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    // Set cookie
    const cookieStore = cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: validatedData.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
      path: "/",
    })

    return { success: true, message: "Login successful" }
  } catch (error) {
    console.error("User login error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation error", errors: error.errors }
    }
    return { success: false, message: "Login failed. Please try again." }
  }
}

/**
 * Send OTP for phone login
 */
export async function sendOTP(formData: FormData) {
  try {
    // Connect to the database
    await dbConnect()

    // Parse and validate form data
    const data = Object.fromEntries(formData.entries())
    const validatedData = phoneLoginSchema.parse(data)

    // Check if phone exists in either user or service provider
    const user = await User.findOne({ phone: validatedData.phone })
    const serviceProvider = await ServiceProvider.findOne({ phone: validatedData.phone })

    if (!user && !serviceProvider) {
      return { success: false, message: "Phone number not registered" }
    }

    // Generate OTP (in a real app, you would send this via SMS)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // In a real application, you would store this OTP in a database or cache
    // with an expiration time, and send it to the user's phone via SMS

    // For demo purposes, we'll just return the OTP
    return {
      success: true,
      message: "OTP sent successfully",
      otp,
      userType: user ? "user" : "service-provider",
    }
  } catch (error) {
    console.error("Send OTP error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation error", errors: error.errors }
    }
    return { success: false, message: "Failed to send OTP. Please try again." }
  }
}

/**
 * Verify OTP for phone login
 */
export async function verifyOTP(formData: FormData) {
  try {
    // Connect to the database
    await dbConnect()

    // Parse and validate form data
    const data = Object.fromEntries(formData.entries())
    const validatedData = otpVerifySchema.parse(data)

    // In a real application, you would verify the OTP against what's stored
    // in your database or cache

    // For demo purposes, we'll assume the OTP is correct

    // Find user or service provider by phone
    const user = await User.findOne({ phone: validatedData.phone })
    const serviceProvider = await ServiceProvider.findOne({ phone: validatedData.phone })

    if (!user && !serviceProvider) {
      return { success: false, message: "Phone number not registered" }
    }

    const account = user || serviceProvider
    const role = user ? "user" : "service-provider"

    // Create JWT token
    const token = jwt.sign({ id: account._id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    return { success: true, message: "Login successful", role }
  } catch (error) {
    console.error("Verify OTP error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation error", errors: error.errors }
    }
    return { success: false, message: "OTP verification failed. Please try again." }
  }
}

/**
 * Logout user or service provider
 */
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
  redirect("/auth")
}

/**
 * Get current authenticated user or service provider
 */
export async function getCurrentUser() {
  try {
    // Connect to the database
    await dbConnect()

    // Get token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return null
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string }

    // Find user or service provider
    if (decoded.role === "user") {
      const user = await User.findById(decoded.id)
      if (!user) return null
      return { ...user.toObject(), role: "user" }
    } else {
      const serviceProvider = await ServiceProvider.findById(decoded.id)
      if (!serviceProvider) return null
      return { ...serviceProvider.toObject(), role: "service-provider" }
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
