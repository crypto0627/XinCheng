'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: ''
  })

  // 從URL參數解析購物車內容
  const cart = JSON.parse(decodeURIComponent(searchParams.get('cart') || '[]'))

  // 計算總金額
  const totalAmount = useMemo(() => {
    const baseTotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
    // 根據數量計算折扣
    const totalQuantity = cart.reduce((acc: number, item: any) => acc + item.quantity, 0)
    if (totalQuantity >= 30) {
      return baseTotal * 0.9
    } else if (totalQuantity >= 20) {
      return baseTotal * 0.95
    }
    return baseTotal
  }, [cart])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    const orderData = {
      ...formData,
      items: cart
    }
    console.log('訂單資料:', orderData)
    // TODO: 送出訂單到後端
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <h1 className="text-3xl font-bold text-orange-600 mb-8">確認訂單</h1>
      
      <div className="bg-white rounded-lg p-6 shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">購物車內容</h2>
        <div className="space-y-4">
          {cart.map((item: any) => (
            <div key={item.productId} className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">數量: {item.quantity}</p>
              </div>
              <p className="font-medium">NT$ {item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <p className="text-xl font-bold">
            總計: NT$ {totalAmount}
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-orange-600 hover:bg-orange-700">
            填寫訂購資料
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>訂購資料</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">電話</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">地址</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment">付款方式</Label>
              <Select
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, paymentMethod: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇付款方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">現金</SelectItem>
                  <SelectItem value="transfer">銀行轉帳</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
            確認送出
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
