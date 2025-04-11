import { OrderService } from '@/api'
import { Order } from '@/types'
import { useState } from 'react'
import Swal from 'sweetalert2'

interface EditOrderProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onOrderUpdate: (updatedOrder: Order) => void
}

export default function EditOrder({
  isOpen,
  onClose,
  order,
  onOrderUpdate
}: EditOrderProps) {
  const [editFormData, setEditFormData] = useState<Partial<Order>>({
    name: order?.name || '',
    phone: order?.phone || '',
    email: order?.email || '',
    items: order?.items ? [...order.items] : [],
    totalPrice: order?.totalPrice || 0,
    orderStatus: order?.orderStatus || 'pending'
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value
    })
  }

  const handleItemChange = (index: number, field: string, value: string) => {
    if (!editFormData.items) return

    const updatedItems = [...editFormData.items]
    if (field === 'name') {
      updatedItems[index] = { ...updatedItems[index], name: value }
    } else if (field === 'quantity') {
      // 確保數量在0-20之間
      const newQuantity = parseInt(value) || 0
      const totalQuantity = updatedItems.reduce(
        (sum, item, idx) => (idx === index ? sum : sum + item.quantity),
        0
      )

      // 確保總數量不超過20
      const maxAllowed = 20 - totalQuantity
      const finalQuantity = Math.min(Math.max(0, newQuantity), maxAllowed)

      updatedItems[index] = { ...updatedItems[index], quantity: finalQuantity }
    }

    setEditFormData({
      ...editFormData,
      items: updatedItems
    })
  }

  const handleDeleteItem = (index: number) => {
    if (!editFormData.items) return

    const updatedItems = [...editFormData.items]
    updatedItems.splice(index, 1)

    setEditFormData({
      ...editFormData,
      items: updatedItems
    })
  }

  const handleAddProduct = (productName: string) => {
    if (!editFormData.items) return

    // 檢查商品是否已存在
    const existingItem = editFormData.items.find(
      (item) => item.name === productName
    )
    if (existingItem) return

    // 新增商品到訂單
    const updatedItems = [
      ...editFormData.items,
      { name: productName, quantity: 1 }
    ]

    setEditFormData({
      ...editFormData,
      items: updatedItems.map((item) => ({
        productId: 'productId' in item ? item.productId : 0,
        name: item.name,
        price: 'price' in item ? item.price : 0,
        quantity: item.quantity
      }))
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return

    try {
      await OrderService.updateOrder(order.id, editFormData)

      // 通知父組件更新已完成
      onOrderUpdate({ ...order, ...editFormData } as Order)

      onClose()
      await Swal.fire({
        title: '已更新！',
        text: '訂單已成功更新',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '確定'
      })
    } catch (error) {
      console.error('更新訂單時發生錯誤:', error)
      Swal.fire({
        title: '更新失敗',
        text: '更新訂單失敗，請稍後再試',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '確定'
      })
    }
  }

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-gray-600/20 text-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-0">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="關閉"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4 pr-8">
          編輯訂單 #{order.id}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="font-medium mb-2">客戶資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  姓名
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  電話
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  電子郵件
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <h3 className="font-medium mb-2 sm:mb-0">
                訂單內容 (可選擇性增加 總數量最多20份)
              </h3>
              <div className="flex flex-wrap gap-2">
                {!editFormData.items?.some(
                  (item) => item.name === '原味雞胸肉'
                ) && (
                  <button
                    type="button"
                    onClick={() => handleAddProduct('原味雞胸肉')}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    + 原味雞胸肉
                  </button>
                )}
                {!editFormData.items?.some(
                  (item) => item.name === '黑胡椒雞胸肉'
                ) && (
                  <button
                    type="button"
                    onClick={() => handleAddProduct('黑胡椒雞胸肉')}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    + 黑胡椒雞胸肉
                  </button>
                )}
                {!editFormData.items?.some(
                  (item) => item.name === '照燒雞胸肉'
                ) && (
                  <button
                    type="button"
                    onClick={() => handleAddProduct('照燒雞胸肉')}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    + 照燒雞胸肉
                  </button>
                )}
              </div>
            </div>
            {editFormData.items?.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-2"
              >
                <div className="flex-grow p-2 bg-gray-100 border border-gray-300 rounded-md w-full sm:w-auto">
                  {item.name}
                </div>
                <span className="mx-1">x</span>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, 'quantity', e.target.value)
                  }
                  className="w-16 sm:w-20 border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  max="20"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteItem(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">訂單狀態</h3>
            <select
              name="orderStatus"
              value={editFormData.orderStatus || ''}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="pending">配送中</option>
              <option value="completed">已完成</option>
              <option value="canceled">已取消</option>
            </select>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">總金額</h3>
            <input
              type="number"
              name="totalPrice"
              value={editFormData.totalPrice || 0}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm sm:text-base"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 text-sm sm:text-base"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
