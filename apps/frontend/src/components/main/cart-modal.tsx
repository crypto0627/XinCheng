'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Product = {
  productName: string
  price: number
  img: string
  weight: string
}

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: {product: Product, quantity: number}[]
  onCheckout: () => void
  onRemoveList: () => void
}


export function CartModal({ isOpen, onClose, cartItems, onCheckout, onRemoveList }: CartModalProps) {
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>購物車明細</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 border-b">
              <div className="flex-1">
                <h3 className="font-medium">{item.product.productName}</h3>
                <p className="text-sm text-gray-500">{item.product.weight}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.product.price} x {item.quantity}</p>
                <p className="text-orange-500 font-bold">${item.product.price * item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">總金額</span>
              <span className="font-bold text-orange-500 text-xl">${totalPrice}</span>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onRemoveList}>
              清空購物車
            </Button>
            <Button variant="outline" onClick={onClose}>
              繼續購物
            </Button>
            <Button onClick={onCheckout} className="bg-orange-500 hover:bg-orange-600">
              確認訂單
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 