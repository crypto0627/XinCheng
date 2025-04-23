'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const router = useRouter()

  useEffect(() => {
    const checkOrder = async () => {
      try {
        await Swal.fire({
          title: '訂單確認',
          text: '感謝您的訂購，我們已收到您的訂單',
          icon: 'success',
          confirmButtonText: '追蹤訂單'
        })
        router.push('/main/checkout/order-info')
      } catch (error) {
        await Swal.fire({
          title: '錯誤',
          text: '訂單確認失敗',
          icon: 'error',
          confirmButtonText: '確定'
        })
        router.push('/main')
      }
    }

    checkOrder()
  }, [router])

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4 text-center">訂單確認</h1>
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-center text-lg">您的訂單已成功處理，我們會盡快為您準備商品。</p>
            <p className="text-gray-700 text-center mb-6">如有任何問題，請聯繫我們的客服團隊。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
