'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CartItem, Product } from '@/types'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

export default function PreOrderPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<{[key: string]: number}>({})
  const [isLoading, setIsLoading] = useState(false)

  const products: Product[] = useMemo(() => [
    {
      productId: '1',
      name: '原味雞胸肉',
      description: '低脂高蛋白，清淡爽口的原味雞胸肉',
      price: 150,
      image: '/chicken-breast-1.jpg'
    },
    {
      productId: '2', 
      name: '黑胡椒雞胸肉',
      description: '香濃黑胡椒醬汁，風味十足的雞胸肉',
      price: 160,
      image: '/chicken-breast-2.jpg'
    },
    {
      productId: '3',
      name: '照燒雞胸肉',
      description: '日式照燒醬汁，甜鹹適中的雞胸肉',
      price: 160,
      image: '/chicken-breast-3.jpg'
    }
  ], [])

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.productId)
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
    
    setQuantities(prev => ({
      ...prev,
      [product.productId]: (prev[product.productId] || 0) + 1
    }))
  }, [])

  const decreaseQuantity = useCallback((productId: string) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.productId === productId && item.quantity > 0) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      }).filter(item => item.quantity > 0)
    })

    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }))
  }, [])

  const totalQuantity = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart])

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      if(totalQuantity > 20) {
        await Swal.fire({
          title: '錯誤',
          text: '單次訂購數量不可超過20份',
          icon: 'error',
          confirmButtonText: '確定'
        })
        return
      }

      // 準備購物車資料
      const cartData = cart
        .filter(item => item.quantity > 0)
        .map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))

      // 將購物車資料編碼並加到URL
      const cartParam = encodeURIComponent(JSON.stringify(cartData))
      router.push(`/pre-order/checkout?cart=${cartParam}`)
    } catch (error) {
      console.error('處理錯誤:', error)
      await Swal.fire({
        title: '錯誤',
        text: '訂單處理發生錯誤，請稍後再試',
        icon: 'error',
        confirmButtonText: '確定'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>團購預訂 - 星橙輕食餐盒</title>
        <meta name="description" content="星橙輕食餐盒團購預訂，提供多種美味雞胸肉餐盒選擇，歡迎企業團體訂購。" />
        <meta name="keywords" content="團購,雞胸肉,輕食,健康餐盒,企業訂餐" />
      </Head>
      <main className="pt-24 bg-[#FFF8E7]">
        <div className="container mx-auto px-4">
          <section className="py-16">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-orange-600">
                團購預訂
              </h1>
              <Button 
                className="bg-orange-600 text-white hover:bg-orange-700 hidden md:block"
                onClick={handleCheckout}
                disabled={isLoading || cart.length === 0}
                aria-label={isLoading ? '處理中' : `前往結帳，目前${totalQuantity}件商品`}
              >
                {isLoading ? '處理中...' : `前往結帳 (${totalQuantity} 件)`}
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {products.map(product => (
                <Card key={product.productId}>
                  <CardHeader>
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardTitle className="text-xl font-semibold text-orange-600">
                      {product.name}
                    </CardTitle>
                    <CardDescription>
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-lg font-bold text-orange-600">${product.price}/份</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => decreaseQuantity(product.productId)}
                        aria-label={`減少${product.name}數量`}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center" role="status" aria-live="polite">
                        {quantities[product.productId] || 0}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addToCart(product)}
                        aria-label={`增加${product.name}數量`}
                      >
                        +
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card className="mt-12 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-orange-600">
                  團購說明
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 最低訂購量：10份起</li>
                  <li>• 配送時間：週一至週五 10:00-18:00</li>
                  <li>• 請提前3天預訂</li>
                  <li>• 滿20份享有95折優惠</li>
                  <li>• 滿30份享有9折優惠</li>
                </ul>
              </CardContent>
            </Card>
            
            <div className="mt-8 md:hidden">
              <Button 
                className="bg-orange-600 text-white hover:bg-orange-700 w-full"
                onClick={handleCheckout}
                disabled={isLoading || cart.length === 0}
                aria-label={isLoading ? '處理中' : `前往結帳，目前${totalQuantity}件商品`}
              >
                {isLoading ? '處理中...' : `前往結帳 (${totalQuantity} 件)`}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
