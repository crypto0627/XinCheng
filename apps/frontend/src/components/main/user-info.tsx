'use client'

import { useEffect, useState } from 'react'
import { authService } from '@/services/authService'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

type User = {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
}

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        setUserInfo(user)
      } catch (error) {
        console.error('獲取用戶信息失敗:', error)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      await Swal.fire({
        title: '登出成功',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      router.push('/login')
    } catch (error) {
      console.error('登出失敗:', error)
      const errorMessage = error instanceof Error ? error.message : '登出失敗'
      await Swal.fire({
        title: '登出失敗',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '確定'
      })
    }
  }

  if (!userInfo) {
    return null
  }

  return (
    <div className="flex items-center justify-end mb-8">
      <p className="mr-4">您好，{userInfo.username}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
      >
        登出
      </button>
    </div>
  )
} 