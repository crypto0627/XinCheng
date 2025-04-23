'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/authService'
import Swal from 'sweetalert2'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'

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

export default function ProfileUpdateModal({ isOpen, onClose, user, onUserUpdated }: ProfileUpdateModalProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { logout } = useAuthStore()

  useEffect(() => {
    if (user) {
      setUsername(user.username || user.name || '')
      setEmail(user.email || '')
      setAddress(user.address || '')
    }
  }, [user])

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
      if (password) updateData.passwordHash = password
      
      if (Object.keys(updateData).length <= 1) {
        await Swal.fire({
          title: '資料未變更',
          text: '請修改資料後再提交',
          icon: 'info',
          confirmButtonText: '確定'
        })
        setIsSubmitting(false)
        return
      }
      
      await authService.updateUser(updateData)
      
      await Swal.fire({
        title: '更新成功',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      
      onUserUpdated()
      onClose()
      setPassword('')
    } catch (error) {
      console.error('更新用戶資料失敗:', error)
      const errorMessage = error instanceof Error ? error.message : '更新用戶資料失敗'
      await Swal.fire({
        title: '更新失敗',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '確定'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleDeleteUser = async () => {
    if (!user) return

    const result = await Swal.fire({
      title: '確定要刪除帳號?',
      text: '此操作無法復原！您的所有資料將被永久刪除。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '是，刪除我的帳號',
      cancelButtonText: '取消'
    })

    if (result.isConfirmed) {
      try {
        setIsSubmitting(true)
        await authService.deleteUser(user.id)
        logout()
        await Swal.fire({
          title: '帳號已刪除',
          text: '您的帳號已成功刪除',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
        onClose()
        router.push('/login')
      } catch (error) {
        console.error('刪除帳號失敗:', error)
        const errorMessage = error instanceof Error ? error.message : '刪除帳號失敗'
        await Swal.fire({
          title: '刪除失敗',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: '確定'
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
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
  )
} 