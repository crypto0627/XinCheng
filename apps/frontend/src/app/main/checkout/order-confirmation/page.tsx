import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: '訂單確認 | 星橙輕食餐盒'
}

export default function OrderConfirmationPage() {
  return (
    <main className="container mx-auto px-4 py-24 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4 text-center">
          訂單確認
        </h1>
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <p className="text-gray-700 mb-4 text-center text-lg">
            您的訂單已成功處理，我們會盡快為您準備商品。
          </p>
          <p className="text-gray-700 text-center mb-6">
            如有任何問題，請聯繫我們的客服團隊。
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            href="/main"
            className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            返回商店
          </Link>
        </div>
      </div>
    </main>
  )
}
