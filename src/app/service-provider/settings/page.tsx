"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "react-toastify"
import { Upload, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { getUser } from "@/app/actions/user"
import { uploadImage } from "@/app/actions/cloudinary"

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Invalid phone number"),
  experience: z.coerce.number().min(0),
    profileImage: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    landmark: z.string().optional(),
  }),
  availability: z.object({
    isAvailable: z.boolean(),
    workingHours: z.object({
      start: z.string(),
      end: z.string(),
    }),
  }),
  bankDetails: z.object({
    accountHolderName: z.string(),
    accountNumber: z.string(),
    ifscCode: z.string(),
    bankName: z.string(),
    branch: z.string(),
  }),
})

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState("/placeholder.svg")

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
  })

  // Load user data when session is available
  React.useEffect(() => {
    if (session?.user?.email) {
      getUser({
        email: session.user.email,
        role: "serviceProvider",
        populate: true,
        vars: "+bankDetails",
      }).then((userData) => {
        if (userData) {
          setPreviewImage(userData.profileImage || "/placeholder.svg")
          form.reset({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            experience: userData.experience,
            address: userData.address,
            availability: userData.availability,
            bankDetails: userData.bankDetails,
          })
        }
      })
    }
  }, [session?.user?.email, form])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) { // 5MB 
      toast.error("Image size should be less than 5MB")
      return
    }

    try {
      setUploadingImage(true)
      
      // Convert file to data URI
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const dataUri = reader.result as string
          const imageUrl = await uploadImage(dataUri)
          if (imageUrl) {
            form.setValue("profileImage", imageUrl)
            setPreviewImage(imageUrl)
            toast.success("Image uploaded successfully")
          }
        } catch (error) {
          toast.error("Error uploading image")
          console.error("Image upload error:", error)
        } finally {
          setUploadingImage(false)
        }
      }
      reader.readAsDataURL(file)
      
    } catch (error) {
      toast.error("Error processing image")
      setUploadingImage(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    setIsLoading(true)
    try {
        console.log(values, form.getValues("profileImage"))
        
      // Update session data with current values
      console.log(await update({
        ...session,
        user: {
          ...session?.user,
          ...values,
        profileImage: form.getValues("profileImage"), // Use form value instead
      }}));

      toast.success("Profile updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your profile and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-32 w-32">
                <img
                  src={previewImage}
                  alt="Profile"
                  className="rounded-full object-cover w-full h-full"
                />
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 text-white" />
                  )}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input {...form.register("email")} type="email" />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input {...form.register("experience")} type="number" />
                {form.formState.errors.experience && (
                  <p className="text-sm text-red-500">{form.formState.errors.experience.message}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input {...form.register("address.street")} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input {...form.register("address.city")} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input {...form.register("address.state")} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input {...form.register("address.pincode")} />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input {...form.register("address.landmark")} />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Availability</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={form.watch("availability.isAvailable")}
                    onCheckedChange={(checked) =>
                      form.setValue("availability.isAvailable", checked)
                    }
                  />
                  <Label>Available for work</Label>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Working Hours Start</Label>
                    <Input
                      type="time"
                      {...form.register("availability.workingHours.start")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Working Hours End</Label>
                    <Input
                      type="time"
                      {...form.register("availability.workingHours.end")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Bank Account Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Account Holder Name</Label>
                  <Input {...form.register("bankDetails.accountHolderName")} />
                </div>
                
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input {...form.register("bankDetails.accountNumber")} />
                </div>
                
                <div className="space-y-2">
                  <Label>IFSC Code</Label>
                  <Input {...form.register("bankDetails.ifscCode")} />
                </div>
                
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input {...form.register("bankDetails.bankName")} />
                </div>
                
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Input {...form.register("bankDetails.branch")} />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
