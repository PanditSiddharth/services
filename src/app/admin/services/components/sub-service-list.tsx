// app/admin/services/components/sub-service-list.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { removeSubService } from "@/app/actions/services"
import { toast } from "react-toastify"

export function SubServiceList({ 
  serviceId, 
  subServices 
}: { 
  serviceId: string
  subServices: any[] 
}) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  async function handleDelete(subServiceId: string) {
    setPendingId(subServiceId)
    try {
      const result = await removeSubService(serviceId, subServiceId)
      if (result.message === "Sub-service removed successfully") {
        toast("Sub-service removed successfully")
      } else {
        toast(result.message)
      }
    } catch (error: any) {
      toast("Failed to remove sub-service" + error.message)
    } finally {
      setPendingId(null)
      setOpen(false)
    }
  }

  if (!subServices || subServices.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No sub-services found. Add your first sub-service below.
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subServices.map((subService) => (
            <TableRow key={subService._id}>
              <TableCell className="font-medium">{subService.name}</TableCell>
              <TableCell>{subService.description || "—"}</TableCell>
              <TableCell>${subService.basePrice.toFixed(2)}</TableCell>
              <TableCell className="capitalize">{subService.priceUnit}</TableCell>
              <TableCell className="text-right">
                <AlertDialog open={open && selectedId === subService._id} onOpenChange={(isOpen) => {
                  setOpen(isOpen)
                  if (!isOpen) setSelectedId(null)
                }}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setSelectedId(subService._id)}
                    >
                      Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently remove this sub-service.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault()
                          handleDelete(subService._id)
                        }}
                        disabled={pendingId === subService._id}
                      >
                        {pendingId === subService._id ? "Removing..." : "Remove"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}