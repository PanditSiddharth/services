"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { signIn } from "next-auth/react"
import connectDB from "@/lib/db-connect"
import { User, ServiceProvider } from "@/models/index"
import { uploadImage } from "@/app/actions/cloudinary"
import { generateOTP, storeOTP, verifyOTP as checkOTP, sendOTP } from "@/lib/otp"
import { serviceProviderRegisterSchema, userRegisterSchema, loginSchema } from "@/models/zod"

// User authentication actions
export async function loginUser(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  try {
    const result = await signIn("credentials", {
      email,
      password,
      role: "user",
      redirect: false,
    })

    if (!result?.ok) {
      return {
        success: false,
        errors: {
          _form: ["Invalid email or password"],
        },
      }
    }

    // Update last login
    await connectDB()
    await User.findOneAndUpdate({ email }, { lastLogin: new Date() })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      errors: {
        _form: ["An error occurred during login. Please try again."],
      },
    }
  }
}

export async function registerUser(formData: FormData) {
  // Extract and validate form data
  const validatedFields = userRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    pincode: formData.get("pincode"),
    landmark: formData.get("landmark"),
    profileImage: formData.get("profileImage"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, phone, street, city, state, pincode, landmark, profileImage } = validatedFields.data

  try {
    await connectDB()

    // Check if user already exists with this email or phone
    const existingUser = await User.findOne({
      $or: [{ email: email && email.length > 0 ? email : null }, { phone: phone }],
    })

    if (existingUser) {
      return {
        success: false,
        errors: {
          _form: ["A user with this email or phone number already exists"],
        },
      }
    }

    // Upload profile image if provided
    let imageUrl = "/placeholder.svg"
    if (profileImage && typeof profileImage === "string" && profileImage.startsWith("data:image")) {
      imageUrl = await uploadImage(profileImage)
    }

    // Create a temporary password (will be updated after OTP verification)
    const tempPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10)

    // Create new user
    const newUser = new User({
      name,
      email: email && email.length > 0 ? email : undefined,
      phone,
      password: tempPassword,
      address: {
        street,
        city,
        state,
        pincode,
        landmark,
      },
      profileImage: imageUrl,
      isPhoneVerified: false, // Will be set to true after OTP verification
    })

    await newUser.save()

    // Generate and store OTP
    const otp = generateOTP()
    storeOTP(phone, otp)

    // Send OTP (in a real app)
    await sendOTP(phone, otp)

    return {
      success: true,
      userId: newUser._id.toString(),
      phone: phone,
      message: "Please verify your phone number with the OTP sent to you.",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      errors: {
        _form: ["Failed to create account. Please try again."],
      },
    }
  }
}

// Provider authentication actions
export async function loginProvider(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  try {
    const result = await signIn("credentials", {
      email,
      password,
      role: "provider",
      redirect: false,
    })

    if (!result?.ok) {
      return {
        success: false,
        errors: {
          _form: ["Invalid email or password"],
        },
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      errors: {
        _form: ["An error occurred during login. Please try again."],
      },
    }
  }
}

export async function registerProvider(formData: FormData) {
  // Extract and validate form data
  const data = JSON.parse(formData.get("data") as string)
  const profileImage = formData.get("profileImage")
  try {
    await connectDB()

    // Check if provider already exists with this email or phone
    const existingProvider = await ServiceProvider.findOne({
      $or: [{ email: data.email }, { phone: data.phone }],
    })

    if (existingProvider) {
      return {
        success: false,
        errors: {
          _form: ["A service provider with this email or phone number already exists"],
        },
      }
    }

    // Upload profile image if provided
    let imageUrl = "/profile-image.jpg"
    if (profileImage && typeof profileImage === "string" && profileImage.startsWith("data:image")) {
      imageUrl = await uploadImage(profileImage)
    }

    // Create new service provider
    const newProvider = new ServiceProvider({
      profileImage: imageUrl,
      isVerified: false, // Providers need to be verified by admin
      isActive: true,
      ...data,
    })

    await newProvider.save()

    return {
      success: true,
      message: "Your registration is successful. Please wait for admin verification.",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      errors: {
        _form: ["Failed to create account. Please try again."],
      },
    }
  }
}

export async function verifyOTP(formData: FormData) {
  const phone = formData.get("phone") as string
  const otp = formData.get("otp") as string
  const userId = formData.get("userId") as string

  // Validate inputs
  if (!phone || !otp || !userId) {
    return {
      success: false,
      errors: {
        _form: ["Missing required information"],
      },
    }
  }

  try {
    await connectDB()

    // Verify OTP
    const isValid = checkOTP(phone, otp)

    if (!isValid) {
      return {
        success: false,
        errors: {
          otp: ["Invalid or expired OTP. Please try again."],
        },
      }
    }

    // Find and update the user
    const user = await User.findById(userId)

    if (!user) {
      return {
        success: false,
        errors: {
          _form: ["User not found"],
        },
      }
    }

    // Generate a random password
    const password = Math.random().toString(36).slice(-8)

    await user.save()

    // Sign in the user
    await signIn("credentials", {
      email: user.email,
      password: password,
      role: "user",
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    console.error("OTP verification error:", error)
    return {
      success: false,
      errors: {
        _form: ["An error occurred during verification. Please try again."],
      },
    }
  }
}
