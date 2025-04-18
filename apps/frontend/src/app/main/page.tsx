'use client'

import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { useEffect, useState } from 'react'
import UserInfo from '@/components/main/user-info'
import { ProductCard } from '@/components/main/product-card'
import { ShoppingCartIcon } from 'lucide-react'
import { CartModal } from '@/components/main/cart-modal'
import Swal from 'sweetalert2'

type Product = {
  productName: string
  price: number
  img: string
  weight: string
}

const products: Product[] = [
  {
    productName: '原味舒肥雞',
    price: 43,
    img: '/main/item1.jpg',
    weight: '100g'
  },
  {
    productName: '麻辣舒肥雞',
    price: 43,
    img: '/main/item2.jpg',
    weight: '100g'
  },
  {
    productName: '真空鮭魚',
    price: 120,
    img: '/main/item3.jpg',
    weight: '180g'
  }
]

export default function MainPage() {
  const router = useRouter()
  const [quantities, setQuantities] = useState<number[]>(products.map(() => 0))
  const [cartCount, setCartCount] = useState(0)
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleIncrease = (index: number) => {
    setQuantities(prev => {
      const newQuantities = [...prev]
      newQuantities[index] += 1
      return newQuantities
    })
  }

  const handleDecrease = (index: number) => {
    setQuantities(prev => {
      const newQuantities = [...prev]
      newQuantities[index] = Math.max(0, newQuantities[index] - 1)
      return newQuantities
    })
  }

  const handleAddToCart = (index: number) => {
    if (quantities[index] > 0) {
      setCartCount(prev => prev + quantities[index])
      setCartItems(prev => {
        const existingItem = prev.find(item => item.product === products[index])
        const newCartItems = existingItem
          ? prev.map(item => 
              item.product === products[index] 
                ? {...item, quantity: item.quantity + quantities[index]}
                : item
            )
          : [...prev, {product: products[index], quantity: quantities[index]}]
        
        // 打印購物車內容
        console.log('購物車內容：')
        newCartItems.forEach((item, i) => {
          console.log(`商品 ${i + 1}:`)
          console.log(`- 名稱: ${item.product.productName}`)
          console.log(`- 價格: $${item.product.price}`)
          console.log(`- 重量: ${item.product.weight}`)
          console.log(`- 數量: ${item.quantity}`)
          console.log(`- 小計: $${item.product.price * item.quantity}`)
          console.log('-------------------')
        })
        console.log(`總金額: $${newCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}`)
        
        return newCartItems
      })
      setQuantities(prev => {
        const newQuantities = [...prev]
        newQuantities[index] = 0
        return newQuantities
      })
    }
  }

  const handleCartClick = () => {
    if (cartCount === 0) return
    setIsCartOpen(true)
  }

  const handleCheckout = () => {
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    
    if (totalQuantity >= 5) {
      // 將購物車資訊存儲到 localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems))
      router.push('/main/checkout')
    } else {
      Swal.fire({
        title: '數量不足',
        text: '請購買至少五份商品',
        icon: 'warning',
        confirmButtonText: '新增商品'
      })
      setIsCartOpen(false)
    }
  }

  const handleRemoveList = () => {
    setQuantities(products.map(() => 0))
    setCartCount(0)
    setCartItems([])
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (!user) {
          await Swal.fire({
            title: '請先登入',
            text: '您需要登入才能訪問結帳頁面',
            icon: 'warning',
            confirmButtonText: '前往登入'
          })
          router.push('/login')
        }
      } catch (error) {
        await Swal.fire({
          title: '請先登入',
          text: '您需要登入才能訪問結帳頁面',
          icon: 'warning',
          confirmButtonText: '前往登入'
        })
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  return (
    <main className="pt-24 bg-[#FFF8E7] min-h-screen">
      <div className="container mx-auto px-4">
        <section className="py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
              <UserInfo />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  quantity={quantities[index]}
                  onIncrease={() => handleIncrease(index)}
                  onDecrease={() => handleDecrease(index)}
                  onAddToCart={() => handleAddToCart(index)}
                />
              ))}
            </div>
          </div>
          <div className="fixed bottom-2 right-2 p-4 hover:scale-110 transition-transform duration-300">
            <div className="flex justify-center items-center">
              <button 
                className="bg-orange-500 text-white px-4 py-2 rounded-md relative"
                onClick={handleCartClick}
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onCheckout={handleCheckout}
        onRemoveList={handleRemoveList}
      />
    </main>
  )
}