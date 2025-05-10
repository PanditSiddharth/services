"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { deleteCookie } from "cookies-next/client"
import { signOut } from "@/auth"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session }:any = useSession()
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      deleteCookie('user', { 
        path: '/',
        domain: process.env.NODE_ENV === "production" ? ".ignoux.in" : undefined
      });
      
      localStorage.clear();
      sessionStorage.clear();
      
      // Use window.location for a full page refresh
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Services
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium ${pathname === "/" ? "text-primary" : "text-gray-600 hover:text-primary"}`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium ${
                pathname === "/services" ? "text-primary" : "text-gray-600 hover:text-primary"
              }`}
            >
              Services
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium ${
                pathname === "/about" ? "text-primary" : "text-gray-600 hover:text-primary"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium ${
                pathname === "/contact" ? "text-primary" : "text-gray-600 hover:text-primary"
              }`}
            >
              Contact
            </Link>

            {(session?.user as any)?.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{session?.user?.name?.charAt(0) || "U"}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session?.user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{session?.user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={session?.user?.role != "serviceProvider" ? "/user/dashboard" : "/admin/dashboard"}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={session?.user?.role != "serviceProvider" ? "/user/profile" : "/admin/profile"}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button 
                      onClick={e=> signOut()}
                      className="w-full flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-2 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={closeMenu}
                className={`text-sm font-medium ${
                  pathname === "/" ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
              >
                Home
              </Link>
              <Link
                href="/services"
                onClick={closeMenu}
                className={`text-sm font-medium ${
                  pathname === "/services" ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
              >
                Services
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className={`text-sm font-medium ${
                  pathname === "/about" ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className={`text-sm font-medium ${
                  pathname === "/contact" ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
              >
                Contact
              </Link>

              {session?.user?.email ? (
                <>
                  <div className="py-2 border-t">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {(session as any)?.user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{session?.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={session?.user?.role != "serviceProvider" ? "/user/dashboard" : "/admin/dashboard"}
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-600 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={session?.user?.role != "serviceProvider" ? "/user/profile" : "/admin/profile"}
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-600 hover:text-primary"
                  >
                    Settings
                  </Link>
                  <LogoutButton className="justify-start px-0" variant="ghost" />
                </>
              ) : (
                <Button asChild>
                  <Link href="/auth" onClick={closeMenu}>
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
