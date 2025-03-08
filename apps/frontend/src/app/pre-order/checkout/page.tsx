'use client'

import { OrderService } from '@/api'
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
import { CartItem, Order } from '@/types'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: ''
  })
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    email: false,
    address: false,
    paymentMethod: false
  })

  // 從URL參數解析購物車內容
  const cart: CartItem[] = JSON.parse(decodeURIComponent(searchParams.get('cart') || '[]'))

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
    setErrors(prev => ({
      ...prev,
      [name]: value.trim() === ''
    }))
  }

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === '',
      phone: formData.phone.trim() === '',
      email: formData.email.trim() === '',
      address: formData.address.trim() === '',
      paymentMethod: formData.paymentMethod === ''
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const orderData: Order = {
        ...formData,
        items: cart,
        totalAmount
      }

      const response = await OrderService.createOrder(orderData)
      console.log('API回應:', response)
      
      // 修改判斷邏輯,不再檢查response.ok
      if (response.error) {
        throw new Error(response.error || '訂單提交失敗')
      }
      
      setOpen(false) // 先關閉對話框
      
      await Swal.fire({
        title: '訂單已成功送出!',
        text: '感謝您的訂購，我們將盡快為您準備訂單，詳細資訊已發送至您的Email，如有任何問題，歡迎隨時與我們聯繫！',
        icon: 'success',
        confirmButtonText: '確定',
        background: '#FFF9F0',
        iconColor: '#F97316',
        confirmButtonColor: '#F97316',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      }).then(() => {
        router.push('/pre-order') // 導回預訂頁面
      })
      
    } catch (error) {
      console.error('訂單提交錯誤:', error)
      await Swal.fire({
        title: '訂單提交失敗',
        text: error instanceof Error ? error.message : '抱歉，請稍後再試',
        icon: 'error',
        confirmButtonText: '確定',
        background: '#FFF9F0',
        iconColor: '#DC2626',
        confirmButtonColor: '#F97316'
      })
    } finally {
      setLoading(false)
    }
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
        <DialogContent 
          className="sm:max-w-[425px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
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
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">請填寫姓名</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">電話</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm">請填寫電話</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">請填寫Email</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">地址</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-500 text-sm">請填寫地址</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment">付款方式</Label>
              <Select
                onValueChange={(value: any) => {
                  setFormData(prev => ({ ...prev, paymentMethod: value }))
                  setErrors(prev => ({ ...prev, paymentMethod: false }))
                }}
              >
                <SelectTrigger className={errors.paymentMethod ? 'border-red-500' : ''}>
                  <SelectValue placeholder="選擇付款方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">現金</SelectItem>
                  <SelectItem value="transfer">銀行轉帳</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && <p className="text-red-500 text-sm">請選擇付款方式</p>}
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            className="bg-orange-600 hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </>
            ) : (
              '確認送出'
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
