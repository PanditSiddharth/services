"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"

export default function ProviderForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you would call an API to send a password reset email
      // For now, we'll just simulate this process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast.success("If an account exists with this email, you will receive a password reset link.")
    } catch (error) {
      toast.error(
      "An error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email to receive a password reset link"
      footerText="Remember your password?"
      footerLinkText="Back to login"
      footerLinkHref="/auth/provider/login"
    >
      {isSubmitted ? (
        <div className="text-center space-y-4">
          <div className="bg-green-50 text-green-800 p-4 rounded-md">
            <p>We have sent a password reset link to:</p>
            <p className="font-medium">{email}</p>
          </div>
          <p className="text-sm text-gray-500">
            Please check your email and follow the instructions to reset your password. The link will expire in 1 hour.
          </p>
          <Button onClick={() => router.push("/auth/service-provider/login")} className="mt-4">
            Back to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
