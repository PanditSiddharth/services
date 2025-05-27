"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MyField } from "@/components/my-field"
import { signIn } from "next-auth/react"

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Email or Mobile is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
})

export default function ServiceProviderLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);

    try {
      // Check if identifier is email or mobile
      const isEmail = values.identifier.includes('@');
      
      signIn("credentials", {
        [isEmail ? 'email' : 'phone']: values.identifier,
        password: values.password,
        role: "serviceProvider",
        redirect: false
      }).then((response) => {
        if (response?.error) {
          toast.error("Invalid credentials. Please try again.")
        } else {
          toast.success("Login successful!");
          router.push("/service-provider");
        }
      })
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-md mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg py-8">
            <CardTitle className="text-2xl font-bold">Service Provider Login</CardTitle>
            <CardDescription className="text-blue-100">Access your service provider account</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <MyField 
                  form={form} 
                  name="identifier" 
                  label="Email or Mobile" 
                  placeholder="john@example.com or 9876543210" 
                />
                
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
                      className="rounded text-blue-600 focus:ring-blue-500"
                      {...form.register("rememberMe")}
                    />
                    <label htmlFor="remember-me" className="text-sm">
                      Remember me
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/service-provider/register" className="text-blue-600 hover:underline font-medium">
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
              <Link href="/auth/customer/login" className="text-sm text-blue-600 hover:underline font-medium">
                Customer Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
