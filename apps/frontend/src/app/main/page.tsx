import type { Metadata } from 'next'
import { products } from '@/lib/products'
import { MainShop } from '@/components/main/main-shop'

export const metadata: Metadata = {
  title: '團購預訂 | 星橙輕食餐盒',
  description: '線上預訂星橙輕食餐盒'
}

export default function MainPage() {
  return (
    <main className="pt-24 bg-[#FFF8E7] min-h-screen">
      <div className="container mx-auto px-4">
        <section className="py-8">
          <MainShop products={products} />
        </section>
      </div>
    </main>
  )
}
