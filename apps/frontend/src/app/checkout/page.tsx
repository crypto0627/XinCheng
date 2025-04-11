'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const CheckoutContent = dynamic(() => import('../../components/checkout/CheckoutContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}