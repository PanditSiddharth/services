'use client'

import React, { useEffect, useState } from 'react'
import Provider from './components/main'
import { getServiceProviders } from '@/app/actions/admin'
import { Metadata } from "next"

const Page = () => {
  const [initialProviders, setInitialProviders] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const service = searchParams.get("service") || ""

      const { providers, hasMore } = await getServiceProviders(
        1,
        10,
        "",
        { filterBy: service }
      )

      setInitialProviders(providers as any)
      setHasMore(hasMore)
    }

    fetchData()
  }, [])

  return (
    <Provider
      initialProviders={initialProviders}
      hasMore={hasMore}
    />
  )
}

// Note: metadata needs to be moved to layout.tsx since it can't be used in client components
export default Page
