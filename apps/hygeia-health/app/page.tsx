"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // If not authenticated, don't render the content (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="flex flex-col items-center">
          <Image 
            src="/logo.png" 
            alt="Hygeia Health Logo" 
            width={320} 
            height={320}
            priority
          />
        </div>

        <p className="text-lg text-gray-600">
          Get a personalized diet and workout plan tailored to your goals, preferences, and lifestyle.
        </p>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Link
            href="/steps/personal-goals"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Planning
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium">Personalized Plans</h3>
            <p className="mt-2 text-gray-600">
              Tailored to your specific goals, preferences, and dietary restrictions.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium">AI-Powered</h3>
            <p className="mt-2 text-gray-600">
              Leveraging advanced AI to create optimal nutrition and fitness strategies.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium">Easy to Follow</h3>
            <p className="mt-2 text-gray-600">Clear, structured plans with daily meals and workout routines.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
