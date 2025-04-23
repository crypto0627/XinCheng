'use client'

import { useState, useEffect, Suspense } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { updateUser, deleteUser } from '@/services/user.service'
import { useRouter } from 'next/navigation'

// Simple toast notification component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [onClose])
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${type === 'success' ? 'bg-orange-500' : 'bg-red-500'} text-white`}>
      {message}
    </div>
  )
}

function SettingsContent() {
  const { user, token, logout } = useAuthStore()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  
  const [toast, setToast] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error'
  }>({
    show: false,
    message: '',
    type: 'success',
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
    })
  }, [user, router])
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({
      show: true,
      message,
      type,
    })
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    try {
      const updateParams = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        ...(formData.password ? { passwordHash: formData.password } : {}),
      }
      
      const response = await updateUser(updateParams, token || undefined)
      
      if (response.error) {
        showToast(response.error, 'error')
      } else {
        showToast('用戶資訊更新成功', 'success')
        setIsEditing(false)
      }
    } catch {
      showToast('更新用戶資訊失敗', 'error')
    }
  }
  
  const handleDeleteAccount = async () => {
    if (!user) return
    
    try {
      const response = await deleteUser({ id: user.id }, token || undefined)
      
      if (response.error) {
        showToast(response.error, 'error')
      } else {
        showToast('帳號已成功刪除', 'success')
        logout() // Clear auth state
        router.push('/')
      }
    } catch {
      showToast('刪除帳號失敗', 'error')
    }
  }
  
  if (!user) {
    return <div className="flex justify-center items-center h-screen">載入中...</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast((prev) => ({ ...prev, show: false }))} 
        />
      )}
      
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-orange-200">
        <h1 className="text-2xl font-bold mb-6 text-orange-700 border-b border-orange-200 pb-3">帳號設定</h1>
        
        {!isEditing ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">用戶資訊</h2>
            <div className="space-y-4 bg-orange-50 p-5 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="text-orange-700 font-medium w-32">姓名</p>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="text-orange-700 font-medium w-32">電子郵件</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="text-orange-700 font-medium w-32">角色</p>
                <p className="font-medium text-gray-800">{user.role === 'admin' ? '管理員' : '普通用戶'}</p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="text-orange-700 font-medium w-32">驗證狀態</p>
                <p className="font-medium">
                  {user.isVerified ? 
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">已驗證</span> : 
                    <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-sm">未驗證</span>
                  }
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 shadow-md"
              >
                編輯資訊
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">編輯用戶資訊</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4 bg-orange-50 p-5 rounded-lg">
              <div>
                <label htmlFor="name" className="block text-orange-700 mb-1 font-medium">
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-orange-700 mb-1 font-medium">
                  電子郵件
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-orange-700 mb-1 font-medium">
                  新密碼（若不修改請留空）
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="flex mt-6">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 mr-4 shadow-md"
                >
                  儲存變更
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white text-orange-700 border border-orange-500 px-4 py-2 rounded-md hover:bg-orange-100 transition-colors duration-200 shadow-sm"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="border-t border-orange-200 pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">危險操作區</h2>
          {!isDeleting ? (
            <button
              onClick={() => setIsDeleting(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 shadow-md"
            >
              刪除帳號
            </button>
          ) : (
            <div className="bg-red-50 p-5 rounded-lg border border-red-200">
              <p className="text-red-600 mb-4 font-medium">
                您確定要刪除您的帳號嗎？此操作不可逆。
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 shadow-md"
                >
                  確認刪除
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="bg-white text-red-700 border border-red-500 px-4 py-2 rounded-md hover:bg-red-100 transition-colors duration-200 shadow-sm"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-orange-600 font-medium">載入中...</p>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}
