"use client"

import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { formatPrice } from "@/lib/utils"

export default function ServiceDetails({ service }: { service: any }) {
  const params = useParams()
  const searchParams = useSearchParams()
  
  // Now you can access params and search params like this:
  const slug = params.slug
  const queryParam = searchParams.get("someParam")

  return (
    <div className="container mx-auto py-12">
      {/* ...existing JSX from page component... */}
    </div>
  )
}
