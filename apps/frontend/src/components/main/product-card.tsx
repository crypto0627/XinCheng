'use client'

import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'

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
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, 384px"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
        <p className="text-sm text-gray-500 mt-1">重量: {product.weight}</p>
        <p className="text-xl font-bold text-orange-600 mt-2">${product.price}</p>
        <div className="flex items-center mt-3">
          <button
            type="button"
            onClick={onDecrease}
            disabled={quantity === 0}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l-md text-gray-700 disabled:opacity-50"
            aria-label="decrease"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300 text-sm font-medium tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-r-md text-gray-700"
            aria-label="increase"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={onAddToCart}
          disabled={quantity === 0}
          aria-label="add-cart"
        >
          加入購物車
        </Button>
      </CardFooter>
    </Card>
  )
}
