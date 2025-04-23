'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import Swal from 'sweetalert2'

export default function GoogleCallback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 嘗試獲取用戶資訊
        const userData = await authService.handleGoogleCallback()
        
        // 如果成功獲取到用戶資訊，使用 googleLogin 更新 store
        if (userData) {
          router.push('/main')
        } else {
          Swal.fire({
            title: '登入失敗',
            text: '無法獲取用戶資訊',
            icon: 'error',
            confirmButtonText: '返回登入頁面'
          }).then(() => {
            router.push('/login')
          })
        }
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
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">正在處理 Google 登入</h2>
          <p className="text-gray-600">請稍候...</p>
        </div>
      ) : (
        <div className="text-center">
          <p>正在重定向...</p>
        </div>
      )}
    </div>
  )
} 