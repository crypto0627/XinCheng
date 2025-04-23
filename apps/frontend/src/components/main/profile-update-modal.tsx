'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/authService'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  username?: string
  name?: string
  email: string
  isVerified: boolean
  address?: string
}

interface ProfileUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onUserUpdated: () => void
}

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

// Notification Modal Component for success and error messages
interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type: 'success' | 'error'
}

function NotificationModal({ isOpen, onClose, title, message, type }: NotificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            {type === 'success' ? (
              <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="mr-2 h-6 w-6 text-red-500" />
            )}
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700">{message}</p>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            onClick={onClose}
            className={type === 'success' ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
          >
            確定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, isLoading }: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">確定要刪除帳號?</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700">此操作無法復原！您的所有資料將被永久刪除。</p>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="mr-2"
          >
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 transition-colors"
          >
            {isLoading ? '處理中...' : '是，刪除我的帳號'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ProfileUpdateModal({ isOpen, onClose, user, onUserUpdated }: ProfileUpdateModalProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [notificationState, setNotificationState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
    action?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  })
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setUsername(user.username || user.name || '')
      setEmail(user.email || '')
      setAddress(user.address || '')
    }
  }, [user])

  const showNotification = (title: string, message: string, type: 'success' | 'error', action?: () => void) => {
    setNotificationState({
      isOpen: true,
      title,
      message,
      type,
      action
    })
  }

  const closeNotification = () => {
    setNotificationState(prev => ({...prev, isOpen: false}))
    if (notificationState.action) {
      notificationState.action()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    setIsSubmitting(true)
    
    try {
      const updateData: {
        id: string
        name?: string
        email?: string
        address?: string
        passwordHash?: string
      } = {
        id: user.id
      }
      
      const currentName = user.username || user.name || ''
      if (username !== currentName) updateData.name = username
      
      if (email !== user.email) updateData.email = email
      if (address !== user.address) updateData.address = address
      
      // Send the raw password - backend will handle hashing
      if (password) {
        updateData.passwordHash = password
      }
      
      if (Object.keys(updateData).length <= 1) {
        showNotification('資料未變更', '請修改資料後再提交', 'error')
        setIsSubmitting(false)
        return
      }
      
      await authService.updateUser(updateData)
      
      showNotification('更新成功', '您的資料已成功更新', 'success', () => {
        onUserUpdated()
        onClose()
      })
      
      setPassword('')
    } catch (error) {
      console.error('更新用戶資料失敗:', error)
      const errorMessage = error instanceof Error ? error.message : '更新用戶資料失敗'
      showNotification('更新失敗', errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleDeleteUser = async () => {
    if (!user) return
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!user) return
    
    try {
      setIsSubmitting(true)
      await authService.deleteUser(user.id)
      setIsDeleteModalOpen(false)
      
      showNotification('帳號已刪除', '您的帳號已成功刪除', 'success', () => {
        onClose()
        router.push('/login')
      })
    } catch (error) {
      console.error('刪除帳號失敗:', error)
      const errorMessage = error instanceof Error ? error.message : '刪除帳號失敗'
      setIsDeleteModalOpen(false)
      showNotification('刪除失敗', errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">更新個人資料</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username">用戶名</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">地址</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">新密碼 (如需更改)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="留空表示不更改密碼"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <div className="flex w-full justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteUser}
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-600 transition-colors"
                >
                  刪除帳號
                </Button>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="mr-2"
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '處理中...' : '更新資料'}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        isLoading={isSubmitting}
      />
      
      <NotificationModal
        isOpen={notificationState.isOpen}
        onClose={closeNotification}
        title={notificationState.title}
        message={notificationState.message}
        type={notificationState.type}
      />
    </>
  )
} 