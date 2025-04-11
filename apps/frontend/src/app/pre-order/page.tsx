'use client'

import { AuthPage } from '@/components/pre-order/auth-page'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function PreOrderPage() {
  const router = useRouter()

  const handleAuthSuccess = async () => {
    await Swal.fire({
      title: '登入成功',
      icon: 'success',
      confirmButtonText: '確定'
    })
    router.push('/checkout')
  }

  const handleAuthError = async (error: Error) => {
    await Swal.fire({
      title: '錯誤',
      text: error.message || '操作失敗，請稍後再試',
      icon: 'error',
      confirmButtonText: '確定'
    })
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
