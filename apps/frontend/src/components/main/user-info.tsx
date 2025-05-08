'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import ProfileUpdateModal from './profile-update-modal'
import { useUserStore } from '@/store/userStore'
import { useState } from 'react'

export default function UserInfo() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const router = useRouter()
  const { userData, logout, checkAuth } = useUserStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogout = async () => {
    try {
      await logout()
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

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true)
  }

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false)
  }

  const handleUserUpdated = async () => {
    await checkAuth()
  }

  if (!userData) {
    return null
  }

  // 優先使用 username，如果沒有則使用 name (Google 登入)
  const displayName = userData.username || userData.name || '用戶'

  return (
    <div className="flex items-center justify-end mb-8">
      <p className="mr-4">您好，{displayName}</p>
      <button
        onClick={handleOpenProfileModal}
        className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        aria-label='profile'
      >
        個人資料
      </button>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        aria-label='logout'
      >
        登出
      </button>
      
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        user={userData}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  )
} 