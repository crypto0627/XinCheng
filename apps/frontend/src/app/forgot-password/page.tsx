'use client'

import { AuthCard } from '@/components/auth/auth-card'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const router = useRouter()

  const handleSubmit = async (email: string) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/request-password-reset`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '重設密碼請求失敗')
      }

      setMessage({
        text: '重設密碼連結已發送至您的電子郵件，請查收',
        type: 'success'
      })
    } catch (error) {
      console.error('忘記密碼處理錯誤:', error)
      setMessage({
        text: error instanceof Error ? error.message : '發生未知錯誤',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen flex items-center justify-center">
      <AuthCard
        title="忘記密碼"
        description="請輸入您的電子郵件，我們將發送重設密碼連結給您"
        footer={{
          text: '返回登入頁面',
          onClick: () => router.push('/pre-order'),
          disabled: isLoading
        }}
      >
        <ForgotPasswordForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          message={message}
        />
      </AuthCard>
    </div>
  )
}
