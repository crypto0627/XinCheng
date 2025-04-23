'use client'

import { AuthPage } from '@/components/login/auth-page'
import { authService } from '@/services/authService'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function LoginPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user && user.data) {
          router.push('/main')
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setIsChecking(false)
      }
    }
    checkAuth()
  }, [router])
  
  const handleAuthSuccess = async () => {

    await Swal.fire({
      title: '登入成功',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
    
    router.push('/main')
  }

  const handleAuthError = async (error: Error) => {
    await Swal.fire({
      title: '錯誤',
      text: error.message || '操作失敗，請稍後再試',
      icon: 'error',
      confirmButtonText: '確定'
    })
  }

  if (isChecking) {
    return (
      <main className="pt-24 bg-[#FFF8E7] min-h-screen">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="text-center">載入中...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-24 bg-[#FFF8E7] min-h-screen">
      <div className="container mx-auto px-4">
        <section className="py-16">
          <div className="max-w-md mx-auto">
            <AuthPage
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
