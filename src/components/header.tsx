"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { deleteCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        path: '/'
      });
      
      localStorage.clear();
      sessionStorage.clear();
      
      // Use window.location for a full page refresh
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const AuthButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2">
          Sign In <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/auth/customer/login" className="w-full">
            Customer Login
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auth/customer/register" className="w-full">
            Customer Register
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/auth/service-provider/login" className="w-full">
            Provider Login
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auth/service-provider/register" className="w-full">
            Provider Register
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

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
              <DropdownMenu >
                <DropdownMenuTrigger asChild className="bg-gray-200 hover:bg-gray-300">
                 {session?.user?.profileImage ? 
                 <Image 
                  src={session?.user?.profileImage || "/placeholder.svg"}
                  alt={session?.user?.name || "Profile"}
                  width={32}
                  height={32}
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                  className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                  />
                 : <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-primary/0 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{session?.user?.name?.charAt(0) || "U"}</span>
                    </div>
                  </Button>}
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
                    <Link href={session?.user?.role != "serviceProvider" ? "/user/dashboard" : "/service-provider"}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={session?.user?.role != "serviceProvider" ? "/user/settings" : "/service-provider/settings"}>
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
              <AuthButton />
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
                    href={session?.user?.role != "serviceProvider" ? "/user/dashboard" : "/service-provider"}
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-600 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={session?.user?.role != "serviceProvider" ? "/user/profile" : "/service-provider"}
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-600 hover:text-primary"
                  >
                    Settings
                  </Link>
                  <LogoutButton className="justify-start px-0" variant="ghost" />
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="text-sm font-medium text-gray-500 pb-2">Customer</div>
                  <Link 
                    href="/auth/customer/login" 
                    className="block py-2 px-3 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/customer/register"
                    className="block py-2 px-3 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                  
                  <div className="border-t my-2"></div>
                  
                  <div className="text-sm font-medium text-gray-500 py-2">Service Provider</div>
                  <Link 
                    href="/auth/service-provider/login"
                    className="block py-2 px-3 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/service-provider/register"
                    className="block py-2 px-3 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
