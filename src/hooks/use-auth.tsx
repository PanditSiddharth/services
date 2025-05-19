"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const isUser = isAuthenticated && (session as any)?.user?.role === "user"
  const isProvider = isAuthenticated && (session as any)?.user?.role === "provider"

  return {
    session,
    isLoading,
    isAuthenticated,
    isUser,
    isProvider,
    signIn,
    signOut,
  }
}
