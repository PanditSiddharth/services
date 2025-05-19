// app/(client)/services/[slug]/page.tsx

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceBySlug } from "@/app/actions/services"
import ServiceDetails from "./components/service-details"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const param = await params
  const service = await getServiceBySlug(param.slug)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: `${service.name} | Your Company`,
    description: service.description,
  }
}

export default async function ServiceDetailsPage({ params }: any) {
  const param = await params
  const service = await getServiceBySlug(param.slug)

  if (!service || !service.isActive) {
    notFound()
  }

  return <ServiceDetails service={service} />
}
