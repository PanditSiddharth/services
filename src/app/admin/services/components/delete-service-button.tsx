// app/admin/services/components/delete-service-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteService } from "@/app/actions/services"
import { toast } from "react-toastify"

export function DeleteServiceButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleDelete() {
    setIsPending(true)
    try {
      const result = await deleteService(id)
      if (result.message === "Service deleted successfully") {
        toast.success("Service deleted successfully")
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast("Failed to delete service", error)
    } finally {
      setIsPending(false)
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            service and all associated sub-services.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}