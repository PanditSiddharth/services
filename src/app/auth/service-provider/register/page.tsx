"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Upload, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "react-toastify"

const formSchema = z
  .object({
    businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
    ownerName: z.string().min(2, { message: "Owner name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Please enter a valid phone number" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    serviceType: z.string({ required_error: "Please select a service type" }),
    experience: z.coerce.number().min(0, { message: "Experience cannot be negative" }),
    description: z.string().min(20, { message: "Description must be at least 20 characters" }),
    // Location fields
    street: z.string().min(1, { message: "Street address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    pincode: z.string().min(1, { message: "Pincode is required" }),
    landmark: z.string().optional(),
    // Availability fields
    isAvailable: z.boolean(),
    workingDays: z.array(z.string()).min(1, { message: "Select at least one working day" }),
    workingHoursStart: z.string().min(1, { message: "Start time is required" }),
    workingHoursEnd: z.string().min(1, { message: "End time is required" }),
    // Payment fields
    accountHolderName: z.string().min(1, { message: "Account holder name is required" }),
    accountNumber: z.string().min(1, { message: "Account number is required" }),
    ifscCode: z.string().min(1, { message: "IFSC code is required" }),
    bankName: z.string().min(1, { message: "Bank name is required" }),
    branch: z.string().min(1, { message: "Branch name is required" }),
    upiId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function ProviderRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      serviceType: "",
      experience: 0,
      description: "",
      // Location defaults
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      // Availability defaults
      isAvailable: true,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      workingHoursStart: "09:00",
      workingHoursEnd: "18:00",
      // Payment defaults
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branch: "",
      upiId: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Here you would integrate with your registration action
      // const response = await registerProvider(values)

      // Simulate registration for now
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Your service provider account has been created. Please log in.")

      router.push("/service-provider")
    } catch (error) {
      toast.error("There was an error creating your account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = () => {
    const fieldsToValidate =
      step === 1
        ? [
            "businessName",
            "ownerName",
            "email",
            "phone",
            "password",
            "confirmPassword",
            "serviceType",
            "experience",
            "description",
          ]
        : step === 2
          ? ["street", "city", "state", "pincode", "workingHoursStart", "workingHoursEnd"]
          : []

    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) setStep(step + 1)
    })
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  // Service types
  const serviceTypes = [
    { id: "electrician", name: "Electrician" },
    { id: "plumber", name: "Plumber" },
    { id: "carpenter", name: "Carpenter" },
    { id: "painter", name: "Painter" },
    { id: "gardener", name: "Gardener" },
    { id: "cleaner", name: "Cleaner" },
    { id: "appliance_repair", name: "Appliance Repair" },
    { id: "ac_repair", name: "AC Repair" },
    { id: "pest_control", name: "Pest Control" },
    { id: "interior_designer", name: "Interior Designer" },
  ]

  // Days of the week for availability
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/auth" className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Service Provider Registration</CardTitle>
            <CardDescription className="text-blue-100">
              Join our platform to offer your professional services
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between mb-8">
              <div
                className={`flex-1 border-b-2 pb-2 ${step >= 1 ? "border-blue-600 text-blue-600" : "border-gray-200 text-gray-400"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center mr-2 ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    1
                  </div>
                  <span className="font-medium">Basic Info</span>
                </div>
              </div>
              <div
                className={`flex-1 border-b-2 pb-2 ${step >= 2 ? "border-blue-600 text-blue-600" : "border-gray-200 text-gray-400"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center mr-2 ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    2
                  </div>
                  <span className="font-medium">Location</span>
                </div>
              </div>
              <div
                className={`flex-1 border-b-2 pb-2 ${step >= 3 ? "border-blue-600 text-blue-600" : "border-gray-200 text-gray-400"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center mr-2 ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    3
                  </div>
                  <span className="font-medium">Payment</span>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-blue-600 mb-2">
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                        <label
                          htmlFor="profile-upload"
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Upload className="h-6 w-6 text-white" />
                        </label>
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Upload profile picture</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input id="businessName" {...form.register("businessName")} placeholder="Your Business Name" />
                        {form.formState.errors.businessName && (
                          <p className="text-sm text-red-500">{form.formState.errors.businessName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">Owner{"'"}s Full Name</Label>
                        <Input id="ownerName" {...form.register("ownerName")} placeholder="John Doe" />
                        {form.formState.errors.ownerName && (
                          <p className="text-sm text-red-500">{form.formState.errors.ownerName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" {...form.register("email")} placeholder="john@example.com" />
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" {...form.register("phone")} placeholder="9876543210" />
                        {form.formState.errors.phone && (
                          <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...form.register("password")} placeholder="••••••••" />
                        {form.formState.errors.password && (
                          <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...form.register("confirmPassword")}
                          placeholder="••••••••"
                        />
                        {form.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="serviceType">Service Type</Label>
                        <Select
                          onValueChange={(value) => form.setValue("serviceType", value)}
                          defaultValue={form.getValues("serviceType")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTypes.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.serviceType && (
                          <p className="text-sm text-red-500">{form.formState.errors.serviceType.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="number"
                          min="0"
                          {...form.register("experience", { valueAsNumber: true })}
                          placeholder="5"
                        />
                        {form.formState.errors.experience && (
                          <p className="text-sm text-red-500">{form.formState.errors.experience.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description</Label>
                      <textarea
                        id="description"
                        {...form.register("description")}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe your services, experience, and expertise..."
                      />
                      {form.formState.errors.description && (
                        <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input id="street" {...form.register("street")} placeholder="123 Main St" />
                      {form.formState.errors.street && (
                        <p className="text-sm text-red-500">{form.formState.errors.street.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...form.register("city")} placeholder="Mumbai" />
                        {form.formState.errors.city && (
                          <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" {...form.register("state")} placeholder="Maharashtra" />
                        {form.formState.errors.state && (
                          <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" {...form.register("pincode")} placeholder="400001" />
                        {form.formState.errors.pincode && (
                          <p className="text-sm text-red-500">{form.formState.errors.pincode.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="landmark">Landmark (Optional)</Label>
                        <Input id="landmark" {...form.register("landmark")} placeholder="Near City Hospital" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Availability</h3>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isAvailable"
                          checked={form.watch("isAvailable")}
                          onCheckedChange={(checked) => form.setValue("isAvailable", checked)}
                        />
                        <Label htmlFor="isAvailable">Available for work</Label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Working Hours</Label>
                          <div className="flex items-center space-x-2">
                            <Input type="time" {...form.register("workingHoursStart")} className="w-full" />
                            <span>to</span>
                            <Input type="time" {...form.register("workingHoursEnd")} className="w-full" />
                          </div>
                          {(form.formState.errors.workingHoursStart || form.formState.errors.workingHoursEnd) && (
                            <p className="text-sm text-red-500">Please specify working hours</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Working Days</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                          {daysOfWeek.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={day}
                                checked={form.watch("workingDays")?.includes(day)}
                                onCheckedChange={(checked) => {
                                  const currentDays = form.watch("workingDays") || []
                                  if (checked) {
                                    form.setValue("workingDays", [...currentDays, day])
                                  } else {
                                    form.setValue(
                                      "workingDays",
                                      currentDays.filter((d) => d !== day),
                                    )
                                  }
                                }}
                              />
                              <Label htmlFor={day} className="text-sm">
                                {day}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {form.formState.errors.workingDays && (
                          <p className="text-sm text-red-500">{form.formState.errors.workingDays.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Bank Account Details</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your payment will be processed to this bank account.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input id="accountHolderName" {...form.register("accountHolderName")} placeholder="John Doe" />
                      {form.formState.errors.accountHolderName && (
                        <p className="text-sm text-red-500">{form.formState.errors.accountHolderName.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input id="accountNumber" {...form.register("accountNumber")} placeholder="XXXXXXXXXXXX" />
                        {form.formState.errors.accountNumber && (
                          <p className="text-sm text-red-500">{form.formState.errors.accountNumber.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input id="ifscCode" {...form.register("ifscCode")} placeholder="SBIN0000123" />
                        {form.formState.errors.ifscCode && (
                          <p className="text-sm text-red-500">{form.formState.errors.ifscCode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" {...form.register("bankName")} placeholder="State Bank of India" />
                        {form.formState.errors.bankName && (
                          <p className="text-sm text-red-500">{form.formState.errors.bankName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input id="branch" {...form.register("branch")} placeholder="Mumbai Main Branch" />
                        {form.formState.errors.branch && (
                          <p className="text-sm text-red-500">{form.formState.errors.branch.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID (Optional)</Label>
                      <Input id="upiId" {...form.register("upiId")} placeholder="yourname@upi" />
                    </div>

                    <div className="pt-4">
                      <h3 className="text-lg font-medium mb-4">Terms and Conditions</h3>
                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" required />
                        <label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <Link href="/terms" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < 3 ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/service-provider/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
