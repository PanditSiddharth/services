import Link from "next/link"
import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
  footerText: string
  footerLinkText: string
  footerLinkHref: string
}

export function AuthLayout({
  children,
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-gray-500">{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <div className="text-sm text-gray-500">
            {footerText}{" "}
            <Link href={footerLinkHref} className="font-medium text-primary hover:underline">
              {footerLinkText}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
