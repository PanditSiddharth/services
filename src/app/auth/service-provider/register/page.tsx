"use client"

import { useEffect, useMemo, useState } from "react"
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
import { getServices } from "@/app/actions/services"
import { signIn } from "next-auth/react"
import { uploadImage } from "@/app/actions/cloudinary"
import { validateReferralCode, completeReferral } from "@/app/actions/referral"
import { createOrUpdateUser } from "@/app/actions/user"
import { getPincodeDetails, getCitiesByState, getStates, getBanks, getBankByIfsc } from "@/lib/postal-api"
import { debounce } from "lodash"

// Updated schema to match MongoDB model
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Please enter a valid phone number" }),
  profession: z.string({ required_error: "Please select a profession" }),
  experience: z.coerce.number().min(0, { message: "Experience cannot be negative" }),
  address: z.object({
    street: z.string().min(1, { message: "Street address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    pincode: z.string().min(1, { message: "Pincode is required" }),
    landmark: z.string().optional(),
  }),
  availability: z.object({
    isAvailable: z.boolean(),
    workingDays: z.array(z.string()).min(1, { message: "Select at least one working day" }),
    workingHours: z.object({
      start: z.string().min(1, { message: "Start time is required" }),
      end: z.string().min(1, { message: "End time is required" }),
    }),
  }),
  bankDetails: z.object({
    accountHolderName: z.string().min(1, { message: "Account holder name is required" }),
    accountNumber: z.string().min(1, { message: "Account number is required" }),
    ifscCode: z.string().min(1, { message: "IFSC code is required" }),
    bankName: z.string().min(1, { message: "Bank name is required" }),
    branch: z.string().min(1, { message: "Branch name is required" }),
  }),
  referralCode: z.string()
    .optional()
    .refine(val => !val || /^[A-Z0-9]{6}$/.test(val), {
      message: "Referral code must be 6 alphanumeric characters"
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Add type for referral validation result
type ReferralValidationResult = {
  success: boolean;
  message?: string;
  data?: {
    referrerId: string;
    referrerName: string;
  };
}

export default function ProviderRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [profileImage, setProfileImage] = useState("/profile-image.jpg")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [referralValidation, setReferralValidation] = useState<ReferralValidationResult | null>(null);
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [bankSearchResults, setBankSearchResults] = useState<{ code: string, name: string }[]>([])
  const [isLoadingBank, setIsLoadingBank] = useState(false)
  const [bankSearchTerm, setBankSearchTerm] = useState('')
  const [selectedBankName, setSelectedBankName] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      profession: "",
      experience: 0,
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
      },
      availability: {
        isAvailable: true,
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        workingHours: {
          start: "09:00",
          end: "18:00",
        },
      },
      bankDetails: {
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branch: "",
      },
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const image = "https://res.cloudinary.com/panditsiddharth/image/upload/v1746615171/services-app/d3zbbp2pwlvuzl8hsadz.jpg"
      const referralCode = values?.referralCode
      delete values?.referralCode
      // Remove the referral code check to allow submission without referral
      const formattedData = {
        ...values,
        role: "serviceProvider",
        profileImage: image || "/profile-image.jpg",
      }

      const user = await createOrUpdateUser(JSON.parse(JSON.stringify(formattedData)))
      if (!user)
        return toast.error("User creation failed. Please try again or contact us!.")

      if (user.success === false)
        return toast.error(user.message || "User creation failed. Please try again or contact us!.")

      // Only complete referral if code exists and is validated
      if (referralCode && referralValidation?.success) {
        console.log("Completing referral for code:", referralCode, user?._id);
        await completeReferral(referralCode, user?._id);
      }
      
      const result = await signIn("credentials", {
          data: JSON.stringify(formattedData),
          redirect: false,
        });
        toast.success("Registration successful!");
        router.push("/service-provider");
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as any)
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = () => {
    const fieldsToValidate =
      step === 1
        ? [
          "name",
          "email",
          "phone",
          "password",
          "confirmPassword",
          "profession",
          "experience",
        ]
        : step === 2
          ? [
            "address.street",
            "address.city",
            "address.state",
            "address.pincode",
            "availability.isAvailable",
            "availability.workingDays",
            "availability.workingHours.start",
            "availability.workingHours.end"
          ]
          : []

    form.trigger(fieldsToValidate as any).then((isValid) => {
      console.log(form.formState.errors, form.getValues())
      if (isValid) setStep(step + 1)
    })
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const [serviceTypes, setServiceTypes] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const services = await getServices("_id name");
        setServiceTypes(services); // Update state with fetched services
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServiceTypes();
  }, []); // Empty dependency array ensures this runs only once

  // Days of the week for availability
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleVerifyReferralCode = async () => {
    const code = form.getValues("referralCode");
    if (!code) {
      toast.error("Please enter a referral code");
      return;
    }

    try {
      const result = await validateReferralCode(code);
      setReferralValidation(result);

      if (result.success) {
        toast.success(`Valid referral code from ${result.data?.referrerName}`);
      } else {
        toast.error(result.message);
        form.setValue("referralCode", "");
      }
    } catch (error) {
      console.error("Referral validation error:", error);
      toast.error("Error validating referral code");
    }
  }

  useEffect(() => {
    // Check for referral code in URL
    const searchParams = new URLSearchParams(window.location.search)
    const refCode = searchParams.get('ref')
    if (refCode) {
      form.setValue("referralCode", refCode)
      // Validate referral code
      handleVerifyReferralCode()
    }
  }, [])

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const statesList = await getStates()
        setStates(statesList)
      } catch (error) {
        console.error('Error loading states:', error)
        toast.error('Failed to load states')
      }
    }
    loadStates()
  }, [])

  // Handler for state change
  const handleStateChange = async (state: string) => {
    form.setValue('address.state', state)
    form.setValue('address.city', '') // Reset city when state changes
    setIsLoadingCities(true)
    try {
      const citiesList = await getCitiesByState(state)
      setCities(citiesList)
    } catch (error) {
      console.error('Error loading cities:', error)
      toast.error('Failed to load cities')
    } finally {
      setIsLoadingCities(false)
    }
  }

  // Handler for pincode change
  const handlePincodeChange = async (pincode: string) => {
    if (pincode.length === 6) {
      try {
        const details = await getPincodeDetails(pincode)
        if (details) {
          form.setValue('address.state', details.state)
          form.setValue('address.city', details.city)
          handleStateChange(details.state)
        }
      } catch (error) {
        console.error('Error fetching pincode details:', error)
        toast.error('Invalid pincode')
      }
    }
  }

  const [debouncedBankSearch] = useState(() => {
    const debounced = (searchTerm: string) => {
      setIsLoadingBank(true)
      getBanks(searchTerm)
        .then(banks => {
          setBankSearchResults(banks)
        })
        .catch(error => {
          console.error('Error searching banks:', error)
          toast.error('Failed to search banks')
        })
        .finally(() => setIsLoadingBank(false))
    }
    return debounce(debounced, 300)
  })

  const handleBankSearch = (searchTerm: string) => {
    setBankSearchTerm(searchTerm)
    debouncedBankSearch(searchTerm)
  }

  const handleBankSelect = (bank: { code: string, name: string }) => {
    form.setValue('bankDetails.bankName', bank.code)
    setSelectedBankName(bank.name)
    setBankSearchTerm(bank.name)
    setBankSearchResults([])
  }

  const handleIfscValidation = async (ifsc: string) => {
    if (ifsc.length === 11) {
      try {
        const bankDetails = await getBankByIfsc(ifsc)
        if (bankDetails) {
          form.setValue('bankDetails.bankName', bankDetails.bankCode)
          form.setValue('bankDetails.branch', bankDetails.branch)
          setBankSearchTerm(bankDetails.bank)
          setSelectedBankName(bankDetails.bank)
          toast.success('Bank details found!')
        } else {
          form.setValue('bankDetails.bankName', '')
          form.setValue('bankDetails.branch', '')
          setBankSearchTerm('')
          setSelectedBankName('')
          toast.error('Invalid IFSC code')
        }
      } catch (error) {
        console.error('Error validating IFSC:', error)
        toast.error('Failed to validate IFSC code')
      }
    }
  }

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
                          src={profileImage}
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

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" {...form.register("name")} placeholder="John Doe" />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                      )}
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
                        <Label htmlFor="profession">Profession</Label>
                        <Select
                          onValueChange={(value) => form.setValue("profession", value)}
                          defaultValue={form.getValues("profession")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your profession" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTypes.map((service) => (
                              <SelectItem key={service._id} value={service._id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.profession && (
                          <p className="text-sm text-red-500">{form.formState.errors.profession.message}</p>
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
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="address.street">Street Address</Label>
                      <Input id="address.street" {...form.register("address.street")} placeholder="123 Main St" />
                      {form.formState.errors["address.street"] && (
                        <p className="text-sm text-red-500">{form.formState.errors["address.street"].message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="address.pincode">Pincode</Label>
                        <Input
                          id="address.pincode"
                          {...form.register("address.pincode")}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          placeholder="400001"
                          maxLength={6}
                        />
                        {form.formState.errors["address.pincode"] && (
                          <p className="text-sm text-red-500">{form.formState.errors["address.pincode"].message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Select
                          value={form.watch("address.state")}
                          onValueChange={handleStateChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Select
                          value={form.watch("address.city")}
                          onValueChange={(city) => form.setValue("address.city", city)}
                          disabled={!form.watch("address.state") || isLoadingCities}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingCities ? "Loading cities..." : "Select city"} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address.landmark">Landmark (Optional)</Label>
                        <Input id="address.landmark" {...form.register("address.landmark")} placeholder="Near City Hospital" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Availability</h3>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="availability.isAvailable"
                          checked={form.watch("availability.isAvailable")}
                          onCheckedChange={(checked: boolean) => form.setValue("availability.isAvailable", checked as never)}
                        />
                        <Label htmlFor="availability.isAvailable">Available for work</Label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Working Hours</Label>
                          <div className="flex items-center space-x-2">
                            <Input type="time" {...form.register("availability.workingHours.start")} className="w-full" />
                            <span>to</span>
                            <Input type="time" {...form.register("availability.workingHours.end")} className="w-full" />
                          </div>
                          {(form.formState.errors["availability.workingHours.start"] || form.formState.errors["availability.workingHours.end"]) && (
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
                                checked={(form.watch("availability.workingDays") as Array<string>)?.includes(day)}
                                onCheckedChange={(checked) => {
                                  const currentDays = form.watch("availability.workingDays") || []
                                  if (checked) {
                                    form.setValue("availability.workingDays", [...currentDays, day] as never)
                                  } else {
                                    form.setValue(
                                      "availability.workingDays",
                                      (currentDays as any).filter((d: any) => d !== day) as never,
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
                        {form.formState.errors["availability.workingDays"] && (
                          <p className="text-sm text-red-500">{form.formState.errors["availability.workingDays"].message}</p>
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
                      <Label htmlFor="bankDetails.accountHolderName">Account Holder Name</Label>
                      <Input
                        id="bankDetails.accountHolderName"
                        {...form.register("bankDetails.accountHolderName")}
                        placeholder="John Doe"
                      />
                      {form.formState.errors["bankDetails.accountHolderName"] && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors["bankDetails.accountHolderName"].message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bankDetails.accountNumber">Account Number</Label>
                        <Input
                          id="bankDetails.accountNumber"
                          {...form.register("bankDetails.accountNumber")}
                          placeholder="XXXXXXXXXXXX"
                        />
                        {form.formState.errors["bankDetails.accountNumber"] && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors["bankDetails.accountNumber"].message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankDetails.ifscCode">IFSC Code</Label>
                        <Input
                          id="bankDetails.ifscCode"
                          {...form.register("bankDetails.ifscCode")}
                          placeholder="SBIN0000123"
                          onChange={(e) => handleIfscValidation(e.target.value.toUpperCase())}
                          className="uppercase"
                        />
                        {form.formState.errors["bankDetails.ifscCode"] && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors["bankDetails.ifscCode"].message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Type to search bank"
                            value={bankSearchTerm}
                            onChange={(e) => handleBankSearch(e.target.value)}
                            onFocus={() => {
                              if (!bankSearchTerm) {
                                handleBankSearch('a') // Load initial list on focus
                              }
                            }}
                          />
                          {isLoadingBank && (
                            <div className="absolute right-3 top-3">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          )}
                          {bankSearchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {bankSearchResults.map((bank) => (
                                <div
                                  key={bank.code}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleBankSelect(bank)}
                                >
                                  {bank.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {form.formState.errors["bankDetails.bankName"] && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors["bankDetails.bankName"].message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankDetails.branch">Branch</Label>
                        <Input
                          id="bankDetails.branch"
                          {...form.register("bankDetails.branch")}
                          placeholder="Mumbai Main Branch"
                          readOnly={form.watch("bankDetails.ifscCode")?.length === 11}
                        />
                        {form.formState.errors["bankDetails.branch"] && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors["bankDetails.branch"].message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Referral Program</h3>
                        <div className="bg-muted p-4 rounded-lg mb-4">
                          <p className="text-sm text-muted-foreground">
                            Have a referral code? Enter it below to earn rewards for both you and your referrer!
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="referralCode"
                            {...form.register("referralCode")}
                            placeholder="Enter code"
                            className="uppercase"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleVerifyReferralCode}
                            disabled={isSubmitting}
                          >
                            Verify Code
                          </Button>
                        </div>
                        {referralValidation?.success && (
                          <p className="text-sm text-green-600">
                            Referral code from: {referralValidation?.data?.referrerName}
                          </p>
                        )}
                      </div>
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
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
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