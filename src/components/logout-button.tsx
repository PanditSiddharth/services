"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"
import { toast } from "react-toastify"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  showIcon?: boolean
  children?: any
}

export function LogoutButton({ variant = "ghost", showIcon = true, children, ...props }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setIsLoading(true)
    try {
      await logout()
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error("Failed to log out. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} onClick={handleLogout} disabled={isLoading} {...props}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && <LogOut className="mr-2 h-4 w-4" />}
          {children || "Logout"}
        </>
      )}
    </Button>
  )
}
