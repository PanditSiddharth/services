import connectDB from "@/lib/db-connect"
import { auth } from "@/auth"
import { User, ServiceProvider } from "@/models/index"

export async function getSession() {
  return await auth() as any
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.id) {
    return null
  }

  try {
    await connectDB()

    if (session.user.role === "user") {
      const user = await User.findById(session.user.id).lean()
      if (!user) return null

      return {
        ...user,
        _id: user._id.toString(),
        role: "user",
      }
    } else if (session.user.role === "provider") {
      const provider = await ServiceProvider.findById(session.user.id).lean()
      if (!provider) return null

      return {
        ...(provider as any),
        _id: (provider as any)?._id.toString(),
        role: "provider",
      }
    }

    return null
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user
}

export async function isAdmin() {
  const session = await getSession()
  return session?.user?.role === "admin"
}

export async function isProvider() {
  const session = await getSession()
  return session?.user?.role === "serviceProvider"
}

export async function isUser() {
  const session = await getSession()
  return session?.user?.role === "user"
}
