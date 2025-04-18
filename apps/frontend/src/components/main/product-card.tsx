'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Product = {
  productName: string
  price: number
  img: string
  weight: string
}

interface ProductCardProps {
  product: Product
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  onAddToCart: () => void
}

export function ProductCard({ 
  product, 
  quantity, 
  onIncrease, 
  onDecrease,
  onAddToCart 
}: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={product.img}
            alt={product.productName}
            fill
            className="object-fill rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
        <p className="text-sm text-gray-500 mt-1">重量: {product.weight}</p>
        <p className="text-xl font-bold text-orange-600 mt-2">${product.price}</p>
        <div className="flex items-center mt-3">
          <button 
            onClick={onDecrease}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l-md text-gray-700 font-bold"
          >
            -
          </button>
          <input 
            type="text" 
            value={quantity}
            readOnly
            className="w-12 h-8 text-center border-t border-b border-gray-300"
          />
          <button 
            onClick={onIncrease}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-r-md text-gray-700 font-bold"
          >
            +
          </button>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={onAddToCart}
        >
          加入購物車
        </Button>
      </CardFooter>
    </Card>
  )
} 