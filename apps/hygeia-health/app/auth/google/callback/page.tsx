'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import Swal from 'sweetalert2'

export default function GoogleCallback() {
  const router = useRouter()
  const { checkAuthStatus, setLoading } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true)
        await checkAuthStatus()
        router.push('/main')
      } catch (error) {
        console.error('Google callback handling error:', error)
        Swal.fire({
          title: '登入失敗',
          text: '處理 Google 登入時發生錯誤',
          icon: 'error',
          confirmButtonText: '返回登入頁面'
        }).then(() => {
          router.push('/login')
        })
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [router, checkAuthStatus, setLoading])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">處理 Google 登入中...</h2>
        <p className="text-gray-600">請稍候...</p>
      </div>
    </div>
  )
} 