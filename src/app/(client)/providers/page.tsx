'use client'

import React, { useEffect, useState } from 'react'
import Provider from './components/main'
import { getServiceProviders } from '@/app/actions/admin'

const Page = () => {
  const [initialProviders, setInitialProviders] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { providers, hasMore } = await getServiceProviders(1, 10)
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

export default Page
