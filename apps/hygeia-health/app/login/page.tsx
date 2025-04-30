"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Fingerprint, Wallet } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const { 
    loginWithGoogle, 
    loginWithPasskey, 
    loginWithWeb3, 
    isLoading, 
    isAuthenticated 
  } = useAuthStore()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/steps/personal-goals')
    }
  }, [isAuthenticated, router])

  const handleGoogleLogin = async () => {
    await loginWithGoogle()
  }

  const handlePasskeyLogin = async () => {
    await loginWithPasskey()
  }

  const handleWalletConnect = async () => {
    // In a real app, you would get the wallet address from a wallet provider
    const mockWalletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    await loginWithWeb3(mockWalletAddress)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Hygeia ai nutritionist x fitness coach</CardTitle>
          <CardDescription className="text-center">
            Chooes your login methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="passkey">Passkey</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>
            <TabsContent value="google" className="space-y-4 pt-4">
              <Button 
                className="w-full" 
                onClick={handleGoogleLogin} 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Continue with Google"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </TabsContent>
            <TabsContent value="passkey" className="space-y-4 pt-4">
              <Button 
                className="w-full" 
                onClick={handlePasskeyLogin} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? "Verifying..." : "Login with Passkey"}
                {!isLoading && <Fingerprint className="ml-2 h-4 w-4" />}
              </Button>
            </TabsContent>
            <TabsContent value="wallet" className="space-y-4 pt-4">
              <Button 
                className="w-full" 
                onClick={handleWalletConnect} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
                {!isLoading && <Wallet className="ml-2 h-4 w-4" />}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <Link href='/privacy' className="text-sm text-center text-gray-500 hover:text-gray-700 hover:underline">
          <div className="text-sm text-start text-gray-500">
            By logging in, you agree to our terms of service and privacy policy
          </div>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}