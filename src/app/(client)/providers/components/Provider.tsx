"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Provider {
    avatar?: React.ReactNode
    name: string
    profession: string
    experience: string
    rating: number
    reviews: number
    bgColor?: string
    textColor?: string
    [key: string]: any
}

const Item: React.FC<{ provider: Provider }> = ({ provider }) => {
    console.log("Provider:", provider)
    return (
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
            <CardContent className="px-4 md:px-6">
                <div className="flex flex-col items-center text-center">
                    <div
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-4`}
                    >
                        {provider?.profileImage ? (
                            <Image
                                src={provider.profileImage}
                                height={100}
                                width={100}
                                alt={provider.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl font-bold text-gray-400">
                                {provider.name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">{provider?.name}</h3>
                    <p className="text-blue-600 font-medium text-sm md:text-base">{provider?.profession}</p>
                    <p className="text-gray-500 text-xs md:text-sm mb-3">{provider?.experience == "0" ? "New" : `${provider.experience} years`}</p>
                    <div className="flex items-center mb-4">
                        <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-medium">{provider?.rating}</span>
                        <span className="text-gray-500 text-xs md:text-sm ml-1">({provider?.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between w-full mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-500">
                            {provider.totalBookings || 0} bookings
                        </div>
                        <Button asChild size="sm">
                            <Link href={`/providers/${provider?._id}`}>View Profile</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Item
