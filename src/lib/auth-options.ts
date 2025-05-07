import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db-connect"
import { User, ServiceProvider } from "@/models/index"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null
        }

        await connectDB()

        try {
          let user
          const { email, password, role } = credentials

          if (role === "user") {
            user = await User.findOne({ email }).select("+password")
          } else if (role === "provider") {
            user = await ServiceProvider.findOne({ email }).select("+password")
          }

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: role,
            image: user.profileImage,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // If it's a social login, we need to check if the user exists
      if (account && account.provider !== "credentials") {
        await connectDB()

        const existingUser = await User.findOne({ email: token.email })

        if (existingUser) {
          token.id = existingUser._id.toString()
          token.role = "user"
        } else {
          // Create a new user if they don't exist
          const newUser = new User({
            name: token.name,
            email: token.email,
            profileImage: token.picture,
            password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
            isEmailVerified: true,
            address: {
              city: "",
              state: "",
              pincode: "",
            },
          })

          await newUser.save()
          token.id = newUser._id.toString()
          token.role = "user"
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
