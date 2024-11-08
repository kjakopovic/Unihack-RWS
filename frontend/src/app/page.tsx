'use client'

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

import * as images from '@/app/constants/images'

function Page() {
    const router = useRouter()

    const handleGetStarted = () => {
        console.log('Get Started')
        router.push('/login')
    }

    return (
        <div className="w-full min-h-screen flex flex-row justify-center bg-primary-950">
            {/* Hero */}
            <div className="flex flex-col items-center w-1/2 p-12 mt-12">
                <h1 className="text-5xl text-center font-bold text-white">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-gradient-100 to-gradient-200 bg-clip-text text-transparent">
                        UrbanPulse
                    </span>
                </h1>
                <h2 className="text-xl font-bold text-center text-white mt-4">
                    Transforming Urban Living Through Innovation and
                    Connectivity
                </h2>
                <button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-t from-gradient-100 via-primary-400 to-gradient-200 text-white font-bold text-lg rounded-lg py-2 px-4 mt-12 w-1/4 z-50"
                >
                    Get Started
                </button>
            </div>

            <Image
                src={images.onboarding}
                alt="onboard"
                className="absolute top-52"
            />
        </div>
    )
}

export default Page
