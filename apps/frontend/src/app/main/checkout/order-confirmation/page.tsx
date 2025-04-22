'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Swal from 'sweetalert2'

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
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">訂單確認</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-700 mb-4">您的訂單已成功處理，我們會盡快為您準備商品。</p>
        <p className="text-gray-700">如有任何問題，請聯繫我們的客服團隊。</p>
      </div>
    </div>
  )
}
