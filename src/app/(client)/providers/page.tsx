import React from 'react'
import Provider from './components/main'
import { getServiceProviders } from '@/app/actions/admin'

const page = async () => {
    const { providers: initialProviders, hasMore } = await getServiceProviders(1, 10)
console.log("Initial Providers:", initialProviders)
  return (
    <Provider initialProviders={initialProviders} hasMore={hasMore} />
  )
}

export default page