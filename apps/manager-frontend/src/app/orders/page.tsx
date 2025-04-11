'use client'

import { OrderService } from '@/api'
import EditOrder from '@/components/orders/edit-order'
import ToggleBox from '@/components/orders/order-togglebox'
import { Order } from '@/types'
import { OrderFilter } from '@/utils/filterDate'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filterType, setFilterType] = useState<
    'all' | 'today' | 'month' | 'quarter' | 'year'
  >('all')
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [orderFilter, setOrderFilter] = useState<OrderFilter | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(
    null
  )

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getAllOrders()
        setOrders(data)
        const newFilter = new OrderFilter(data)
        setOrderFilter(newFilter)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    if (!orderFilter) return
    switch (filterType) {
      case 'all':
        setFilteredOrders(orders)
        break
      case 'today':
        setFilteredOrders(orderFilter.filterByToday())
        break
      case 'month':
        setFilteredOrders(orderFilter.filterByMonth())
        break
      case 'quarter':
        setFilteredOrders(orderFilter.filterByQuarter())
        break
      case 'year':
        setFilteredOrders(orderFilter.filterByYear())
        break
      default:
        setFilteredOrders([])
    }
  }, [filterType, orderFilter, orders])

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: '待處理',
      completed: '已完成',
      canceled: '已取消'
    }
    return statusMap[status] || status
  }

  const handleEditClick = (order: Order) => {
    setCurrentOrder(order)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = async (orderId: string) => {
    const result = await Swal.fire({
      title: '確定要刪除此訂單嗎？',
      text: '此操作將無法復原！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消操作'
    })

    if (!result.isConfirmed) return

    try {
      await OrderService.deleteOrder(orderId)
      const updatedOrders = orders.filter((order) => order.id !== orderId)
      setOrders(updatedOrders)
      const newFilter = new OrderFilter(updatedOrders)
      setOrderFilter(newFilter)

      await Swal.fire({
        title: '已刪除！',
        text: '訂單已成功刪除',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '確定'
      })
    } catch (error) {
      console.error('刪除訂單時發生錯誤:', error)
      Swal.fire({
        title: '刪除失敗',
        text: '刪除訂單失敗，請稍後再試',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '確定'
      })
    }
  }

  const handleOrderUpdate = (updatedOrder: Order) => {
    // 更新本地訂單列表
    const updatedOrders = orders.map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order
    )
    setOrders(updatedOrders)
    const newFilter = new OrderFilter(updatedOrders)
    setOrderFilter(newFilter)
    setIsEditModalOpen(false)
  }

  const toggleStatusDropdown = (orderId: string) => {
    if (statusDropdownOpen === orderId) {
      setStatusDropdownOpen(null)
    } else {
      setStatusDropdownOpen(orderId)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await OrderService.updateOrder(orderId, { orderStatus: newStatus })

      // 更新本地訂單列表
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
      setOrders(updatedOrders as Order[])
      const newFilter = new OrderFilter(updatedOrders as Order[])
      setOrderFilter(newFilter)

      setStatusDropdownOpen(null)

      await Swal.fire({
        title: '已更新！',
        text: '訂單狀態已成功更新',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '確定'
      })
    } catch (error) {
      console.error('更新訂單狀態時發生錯誤:', error)
      Swal.fire({
        title: '更新失敗',
        text: '更新訂單狀態失敗，請稍後再試',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '確定'
      })
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          訂單管理
        </h1>
        <ToggleBox<'all' | 'today' | 'month' | 'quarter' | 'year'>
          value={filterType}
          options={[
            { value: 'all', label: '所有訂單' },
            { value: 'today', label: '今日訂單' },
            { value: 'month', label: '本月訂單' },
            { value: 'quarter', label: '本季訂單' },
            { value: 'year', label: '本年訂單' }
          ]}
          displayText={(value) => {
            switch (value) {
              case 'all':
                return '所有訂單'
              case 'today':
                return '今日訂單'
              case 'month':
                return '本月訂單'
              case 'quarter':
                return '本季訂單'
              case 'year':
                return '本年訂單'
              default:
                return '所有訂單'
            }
          }}
          onSelect={setFilterType}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單編號
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客戶資訊
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單內容
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    建立時間
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900">
                        {order.name}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        {order.phone}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        {order.email}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="text-xs md:text-sm text-gray-900">
                        {order.items.map((item, index) => (
                          <div key={index}>
                            {item.name} x {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                      ${order.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap relative">
                      <div className="relative">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusColor(order.orderStatus)} cursor-pointer`}
                          onClick={() => toggleStatusDropdown(order.id)}
                        >
                          {getOrderStatusText(order.orderStatus)}
                        </span>
                        {statusDropdownOpen === order.id && (
                          <div className="absolute z-10 mt-1 w-28 md:w-36 bg-white shadow-lg rounded-md py-1 text-xs md:text-sm">
                            <div
                              className="px-3 md:px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() =>
                                updateOrderStatus(order.id, 'pending')
                              }
                            >
                              待處理
                            </div>
                            <div
                              className="px-3 md:px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() =>
                                updateOrderStatus(order.id, 'completed')
                              }
                            >
                              已完成
                            </div>
                            <div
                              className="px-3 md:px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() =>
                                updateOrderStatus(order.id, 'canceled')
                              }
                            >
                              已取消
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {order.createdAt}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(order)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2 md:mr-3"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
            此時段尚無訂單
          </div>
        )}
      </div>

      {/* 編輯訂單彈窗 */}
      <EditOrder
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        order={currentOrder}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  )
}
