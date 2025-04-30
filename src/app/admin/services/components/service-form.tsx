// app/admin/services/components/service-form.tsx
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form } from "@/components/ui/form"
import { createService, updateService } from "@/app/actions/services"
import { MyField } from "@/components/my-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
// List of available icons (this should match with your Icons component)
const AVAILABLE_ICONS = [
  "Wrench", 
  "Tool", 
  "Home", 
  "Car", 
  "Trash", 
  "Garden", 
  "Electric", 
  "Water", 
  "Cleaning", 
  "Moving"
]

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().default("Wrench"),
  image: z.string().default("/placeholder.svg"),
  isActive: z.boolean().default(true),
})

export function ServiceForm({ service = null }: { service?: any }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description,
          icon: service.icon,
          image: service.image,
          isActive: service.isActive,
        }
      : {
          name: "",
          description: "",
          icon: "Wrench",
          image: "/placeholder.svg",
          isActive: true,
        },
  })

  async function onSubmit(data:any) {
    setIsPending(true)
    
    try {
      const formData = new FormData()
      
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, (value as any)?.toString())
      })
      
      const result = service
        ? await updateService(service._id, formData)
        : await createService(formData)
      
      if (result?.errors) {
        const errors = result.errors
        Object.keys(errors).forEach((key) => {
          form.setError(key as any, {
            type: "server",
            message: (errors as any)[key][0] as any,
          })
        })
        toast.error( result.message )
      } else if (result?.message && (result as any)?.success == true) {
        toast.info(result.message)
        router.push("/admin/dashboard")
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again." + error.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <MyField
          form={form}
          name="name"
          label="Service Name"
          placeholder="Enter service name"
        />
        
        <MyField
          form={form}
          name="description"
          label="Description"
          description="Provide a detailed description of the service"
          input={(field) => (
            <Textarea
              placeholder="Enter service description"
              className="min-h-32"
              {...field}
            />
          )}
        />
        
        <MyField
          form={form}
          name="icon"
          label="Icon"
          input={(field) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ICONS.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    {icon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        
        <MyField
          form={form}
          name="image"
          label="Image URL"
          placeholder="/placeholder.svg"
          description="URL to the service image"
        />
        
        <MyField
          form={form}
          name="isActive"
          label="Active Status"
          input={(field) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Service is active and visible to customers
              </label>
            </div>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : service ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  )
}