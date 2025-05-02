"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyField } from "@/components/my-field"
import { loginUser, sendOTP, verifyOTP } from "@/app/actions/auth"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
})

const phoneSchema = z.object({
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Please enter a valid phone number" }),
})

const otpSchema = z.object({
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Please enter a valid phone number" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
})

export default function UserLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      phone: "",
      otp: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Add all form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      const result = await loginUser(formData)

      if (result.success) {
        toast.success(result.message)
        router.push("/dashboard")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendOTP = async (values: z.infer<typeof phoneSchema>) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("phone", values.phone)

      const result = await sendOTP(formData)

      if (result.success) {
        toast.success(result.message)
        setOtpSent(true)
        setPhoneNumber(values.phone)
        otpForm.setValue("phone", values.phone)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      toast.error("Failed to send OTP. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOTP = async (values: z.infer<typeof otpSchema>) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("phone", values.phone)
      formData.append("otp", values.otp)

      const result = await verifyOTP(formData)

      if (result.success) {
        toast.success(result.message)
        router.push("/dashboard")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Verify OTP error:", error)
      toast.error("OTP verification failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-md mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">User Login</CardTitle>
            <CardDescription className="text-teal-100">Access your account to find services</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone">Phone</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>

              <TabsContent value="phone">
                {!otpSent ? (
                  <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(handleSendOTP)} className="space-y-4">
                      <MyField form={phoneForm} name="phone" label="Phone Number" placeholder="9876543210" />

                      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send OTP"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-4">
                      <div className="text-sm mb-4">
                        OTP sent to <span className="font-medium">{phoneNumber}</span>
                      </div>

                      <MyField form={otpForm} name="otp" label="Enter OTP" placeholder="123456" />

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setOtpSent(false)}>
                          Change Number
                        </Button>

                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                          {isSubmitting ? "Verifying..." : "Verify OTP"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </TabsContent>

              <TabsContent value="email">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <MyField form={form} name="email" label="Email Address" placeholder="john@example.com" />

                    <div className="relative">
                      <MyField
                        form={form}
                        name="password"
                        label="Password"
                        placeholder="••••••••"
                        fields={{
                          type: showPassword ? "text" : "password",
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="remember-me"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          {...form.register("rememberMe")}
                        />
                        <label htmlFor="remember-me" className="text-sm">
                          Remember me
                        </label>
                      </div>
                      <Link href="/auth/forgot-password" className="text-sm text-teal-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/user/register" className="text-teal-600 hover:underline font-medium">
                Register here
              </Link>
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue as</span>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/auth/service-provider/login" className="text-sm text-teal-600 hover:underline font-medium">
                Service Provider Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
