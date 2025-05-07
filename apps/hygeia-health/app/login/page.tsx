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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const { 
    loginWithGoogle, 
    loginWithPasskey,
    checkUserInfoWithPasskey,
    loginWithWeb3, 
    isLoading, 
    isAuthenticated,
    user
  } = useAuthStore()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleGoogleLogin = async () => {
    await loginWithGoogle()
  }

  // 用PassKey註冊
  const handlePasskeyRegister = async () => {
    if (!email || !name) {
      return
    }
    await loginWithPasskey(email, name)
    setIsDialogOpen(false)
  }

  // 驗證使用者是否用Passkey註冊過
  const handlePasskeyLogin = async () => {
    if (!email) {
      return
    }
    await checkUserInfoWithPasskey(email)
    setIsLoginDialogOpen(false)
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    variant="outline"
                  >
                    Register with Passkey
                    <Fingerprint className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Passkey Register</DialogTitle>
                    <DialogDescription>
                      Please enter your email and name to continue with passkey register.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handlePasskeyRegister}
                      disabled={isLoading || !email || !name}
                    >
                      {isLoading ? "Verifying..." : "Register"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="border-b-2 border-gray-300 w-full my-4" />
              <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    variant="outline"
                  >
                    Login with Passkey
                    <Fingerprint className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Passkey Login</DialogTitle>
                    <DialogDescription>
                      Please enter your email to continue with passkey login.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handlePasskeyLogin}
                      disabled={isLoading || !email}
                    >
                      {isLoading ? "Verifying..." : "Login"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
          <Link href='/' className="text-sm text-center text-gray-500 hover:text-gray-700 hover:underline">
          <div className="text-sm text-start text-gray-500">
            By logging in, you agree to our terms of service and privacy policy
          </div>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}