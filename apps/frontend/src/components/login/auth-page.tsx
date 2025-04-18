'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'
import { AuthForm } from './auth-form'
import { SocialAuthButtons } from './social-auth-buttons'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { authService } from '@/services/authService'

interface AuthPageProps {
  onAuthSuccess: () => void
  onAuthError: (error: Error) => void
}

export function AuthPage({ onAuthSuccess, onAuthError }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (
    email: string,
    password: string,
    confirmPassword?: string,
    username?: string
  ) => {
    setIsLoading(true)

    try {
      if (!isLogin && password !== confirmPassword) {
        throw new Error('密碼與確認密碼不符')
      }

      if (isLogin) {
        await authService.login({ email, password })
        onAuthSuccess()
      } else {
        if (!username) {
          throw new Error('請輸入用戶名')
        }
        await handleRegister(email, password, username)
      }
    } catch (error) {
      console.error('處理錯誤:', error)
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤'
      onAuthError(error instanceof Error ? error : new Error('未知錯誤'))
      await Swal.fire({
        title: '錯誤',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '確定'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (email: string, password: string, username: string) => {
    try {
      await authService.register({ username, email, password })
      await Swal.fire({
        title: '註冊成功！',
        text: '請查看您的信箱以驗證電子郵件',
        icon: 'success',
        confirmButtonText: '確定'
      })
      setIsLogin(true)
    } catch (error) {
      console.error('註冊錯誤:', error)
      const errorMessage = error instanceof Error ? error.message : '註冊失敗'
      onAuthError(error instanceof Error ? error : new Error('註冊失敗'))
      await Swal.fire({
        title: '錯誤',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '確定'
      })
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await authService.googleLogin()
    } catch (error) {
      console.error('Google登入錯誤:', error)
      const errorMessage = error instanceof Error ? error.message : 'Google登入失敗'
      onAuthError(error instanceof Error ? error : new Error('Google登入失敗'))
      await Swal.fire({
        title: '錯誤',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '確定'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasskeyLogin = async () => {
    setIsLoading(true)
    try {
      // 模擬Passkey驗證
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onAuthSuccess()
    } catch (error) {
      console.error('Passkey驗證錯誤:', error)
      const errorMessage = error instanceof Error ? error.message : 'Passkey驗證失敗'
      onAuthError(error instanceof Error ? error : new Error('Passkey驗證失敗'))
      await Swal.fire({
        title: '錯誤',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '確定'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    router.push('/forgot-password')
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="星橙 Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-orange-600">
          {isLogin ? '登入帳號' : '註冊帳號'}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin
            ? '歡迎回來，請輸入您的帳號密碼'
            : '加入星橙，享受健康美味的餐點'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm
          isLogin={isLogin}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />

        {isLogin && (
          <div className="mt-2 text-right">
            <Button
              variant="link"
              className="text-sm text-orange-600 p-0 h-auto"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              忘記密碼？
            </Button>
          </div>
        )}

        <SocialAuthButtons
          isLogin={isLogin}
          isLoading={isLoading}
          onGoogleLogin={handleGoogleLogin}
          onPasskeyLogin={handlePasskeyLogin}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          className={cn('text-orange-600', isLoading && 'pointer-events-none')}
          onClick={() => setIsLogin(!isLogin)}
          disabled={isLoading}
        >
          {isLogin ? '還沒有帳號？點此註冊' : '已有帳號？點此登入'}
        </Button>
      </CardFooter>
    </Card>
  )
}
