// app/actions/services.ts
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import dbConnect from "@/lib/db-connect"
import Service from "@/models/service"

// Zod schema for subservice validation
const SubServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  basePrice: z.coerce.number().min(0, "Price must be positive"),
  priceUnit: z.enum(["hour", "day", "job"]).default("hour"),
})

// Zod schema for service validation
const ServiceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().default("Wrench"),
  image: z.string().default("/placeholder.svg"),
  isActive: z.boolean().default(true),
  subServices: z.array(SubServiceSchema).optional(),
})

// Create service
export async function createService(formData: FormData) {

  const validatedFields = ServiceSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("name")?.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "service",
    description: formData.get("description"),
    icon: formData.get("icon") || "Wrench",
    image: formData.get("image") || "/placeholder.svg",
    isActive: formData.get("isActive") === "true",
    subServices: [], // Initialize with empty array
  })
  console.log(validatedFields)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create service",
    }
  }

  const data = validatedFields.data

  try {
    await dbConnect()
    
    // Check if service already exists
    const existingService = await Service.findOne({ name: data.name })
    if (existingService) {
      return {
        errors: { name: ["Service with this name already exists"] },
        message: "Failed to create service",
      }
    }
    console.log("Creating service with data:", data)
    // Create service
    await Service.create(data)
    return { success: true, message: "Service created successfully" }
  } catch (error) {
    console.error("Error creating service:", error)
    return {
      message: "Database error: Failed to create service",
    }
  }
}

// Update service
export async function updateService(id: string, formData: FormData) {
  const validatedFields = ServiceSchema.safeParse({
    slug: formData.get("name")?.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "service",
    name: formData.get("name"),
    description: formData.get("description"),
    icon: formData.get("icon") || "Wrench",
    image: formData.get("image") || "/placeholder.svg",
    isActive: formData.get("isActive") === "true",
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to update service",
    }
  }

  const data = validatedFields.data

  try {
    await dbConnect()
    
    // Find service by ID and update
    await Service.findByIdAndUpdate(id, data)
    return { success: true, message: "Service updated successfully" }
  } catch (error) {
    console.error("Error updating service:", error)
    return {
      message: "Database error: Failed to update service",
    }
  }
}

// Delete service
export async function deleteService(id: string) {
  try {
    await dbConnect()
    await Service.findByIdAndDelete(id)
    revalidatePath("/admin/services")
    return { message: "Service deleted successfully" }
  } catch (error) {
    console.error("Error deleting service:", error)
    return {
      message: "Database error: Failed to delete service",
    }
  }
}

// Add subservice to a service
export async function addSubService(serviceId: string, formData: FormData) {
  const validatedFields = SubServiceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    basePrice: formData.get("basePrice"),
    priceUnit: formData.get("priceUnit") || "hour",
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to add sub-service",
    }
  }

  const subServiceData = validatedFields.data

  try {
    await dbConnect()
    
    await Service.findByIdAndUpdate(
      serviceId,
      { $push: { subServices: subServiceData } },
      { new: true }
    )
    
    revalidatePath(`/admin/services/${serviceId}`)
    return { message: "Sub-service added successfully" }
  } catch (error) {
    console.error("Error adding sub-service:", error)
    return {
      message: "Database error: Failed to add sub-service",
    }
  }
}

// Remove subservice from a service
export async function removeSubService(serviceId: string, subServiceId: string) {
  try {
    await dbConnect()
    
    await Service.findByIdAndUpdate(
      serviceId,
      { $pull: { subServices: { _id: subServiceId } } },
      { new: true }
    )
    
    revalidatePath(`/admin/services/${serviceId}`)
    return { message: "Sub-service removed successfully" }
  } catch (error) {
    console.error("Error removing sub-service:", error)
    return {
      message: "Database error: Failed to remove sub-service",
    }
  }
}

// Get all services
export async function getServices() {
  try {
    await dbConnect()
    const services = await Service.find().sort({ createdAt: -1 })
    console.log("Fetched services:", services)
    return JSON.parse(JSON.stringify(services))
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

// Get service by id
export async function getServiceById(id: string) {
  try {
    await dbConnect()
    const service = await Service.findById(id)
    if (!service) return null
    return JSON.parse(JSON.stringify(service))
  } catch (error) {
    console.error("Error fetching service:", error)
    return null
  }
}

// Get service by slug
export async function getServiceBySlug(slug: string) {
  try {
    await dbConnect()
    const service = await Service.findOne({ slug })
    if (!service) return null
    return JSON.parse(JSON.stringify(service))
  } catch (error) {
    console.error("Error fetching service:", error)
    return null
  }
}