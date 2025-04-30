// app/admin/services/components/sub-service-form.tsx
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { addSubService } from "@/app/actions/services"
import { MyField } from "@/components/my-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  basePrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a positive number",
  }),
  priceUnit: z.enum(["hour", "day", "job"]).default("hour"),
})

export function SubServiceForm({ serviceId }: { serviceId: string }) {
  const [isPending, setIsPending] = useState(false)
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: "",
      priceUnit: "hour",
    },
  })

  async function onSubmit(data: any) {
    setIsPending(true)
    
    try {
      const formData = new FormData()
      
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString())
      })
      
      const result = await addSubService(serviceId, formData)
      
      if (result?.errors) {
        const errors = result.errors
        Object.keys(errors).forEach((key) => {
          form.setError(key as any, {
            type: "server",
            message: (errors as any)[key][0],
          })
        })
        toast.error(result.message)
      } else if (result?.message === "Sub-service added successfully") {
        toast.success("Sub-service added successfully")
        form.reset()
      } else {
        toast.error(result.message)
      }
    } catch (error:any) {
      toast("An unexpected error occurred. Please try again." + error.message)
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
          label="Sub-Service Name"
          placeholder="Enter sub-service name"
        />
        
        <MyField
          form={form}
          name="description"
          label="Description"
          placeholder="Enter sub-service description (optional)"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <MyField
            form={form}
            name="basePrice"
            label="Base Price"
            placeholder="0.00"
          />
          
          <MyField
            form={form}
            name="priceUnit"
            label="Price Unit"
            input={(field) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Per Hour</SelectItem>
                  <SelectItem value="day">Per Day</SelectItem>
                  <SelectItem value="job">Per Job</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add Sub-Service"}
          </Button>
        </div>
      </form>
    </Form>
  )
}