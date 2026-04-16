'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCartIcon } from 'lucide-react'
import Swal from 'sweetalert2'
import { ProductCard } from '@/components/main/product-card'
import { CartModal } from '@/components/main/cart-modal'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/types'

interface MainShopProps {
  products: Product[]
}

export function MainShop({ products }: MainShopProps) {
  const router = useRouter()
  const cart = useCart()
  const [quantities, setQuantities] = useState<number[]>(() => products.map(() => 0))
  const [isCartOpen, setIsCartOpen] = useState(false)

  const updateQuantity = (index: number, delta: number) => {
    setQuantities((prev) => {
      const next = [...prev]
      next[index] = Math.max(0, next[index] + delta)
      return next
    })
  }

  const handleAddToCart = (index: number) => {
    const quantity = quantities[index]
    if (quantity <= 0) return

    cart.add(products[index], quantity)
    setQuantities((prev) => prev.map((q, i) => (i === index ? 0 : q)))
  }

  const handleCheckout = async () => {
    if (cart.totalCount < 1) {
      await Swal.fire({
        title: '數量不足',
        text: '請購買至少一份商品',
        icon: 'warning',
        confirmButtonText: '新增商品'
      })
      setIsCartOpen(false)
      return
    }

    localStorage.setItem('cart', JSON.stringify(cart.items))
    router.push('/main/checkout')
  }

  const handleClearCart = () => {
    setQuantities(products.map(() => 0))
    cart.clear()
  }

  const productList = useMemo(
    () =>
      products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={quantities[index]}
          onIncrease={() => updateQuantity(index, 1)}
          onDecrease={() => updateQuantity(index, -1)}
          onAddToCart={() => handleAddToCart(index)}
        />
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, quantities]
  )

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList}
        </div>
      </div>

      <button
        type="button"
        onClick={() => cart.totalCount > 0 && setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 disabled:opacity-60"
        aria-label="shopping-cart"
        disabled={cart.totalCount === 0}
      >
        <ShoppingCartIcon className="w-6 h-6" />
        {cart.totalCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cart.totalCount}
          </span>
        )}
      </button>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart.items}
        onCheckout={handleCheckout}
        onRemoveList={handleClearCart}
      />
    </>
  )
}
