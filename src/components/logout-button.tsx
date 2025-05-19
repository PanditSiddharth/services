"use client"

import { useState } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { deleteCookie } from "cookies-next"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  showIcon?: boolean
  children?: any
  [key: string]: any
}

export function LogoutButton({ variant = "ghost", showIcon = true, children, ...props }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    try {
      deleteCookie('user', { 
        path: '/'
      });
      
      localStorage.clear();
      sessionStorage.clear();
      
      // Use window.location for a full page refresh
      window.location.href = "/auth";
      
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to log out. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleLogout} disabled={isLoading} {...props}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && <LogOut className="mr-2 h-4 w-4" />}
          {children || "Logout"}
        </>
      )}
    </button>
  )
}
