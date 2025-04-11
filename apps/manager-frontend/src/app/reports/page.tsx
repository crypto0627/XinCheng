'use client'
import { OrderService } from '@/api'
import { OrderFilter } from '@/utils/filterDate'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Order } from '../../types'

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [orderFilter, setOrderFilter] = useState<OrderFilter | null>(null)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [filterType, setFilterType] = useState<
    'all' | 'today' | 'month' | 'quarter' | 'year'
  >('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [productStats, setProductStats] = useState<
    {
      name: string
      quantity: number
      revenue: number
    }[]
  >([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalRefund, setTotalRefund] = useState(0)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getAllOrders()
        setOrders(data)

        const newFilter = new OrderFilter(data)
        setOrderFilter(newFilter)
        setFilteredOrders(data) // 預設顯示所有訂單
      } catch (error) {
        console.error('錯誤：獲取訂單失敗', error)
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

  useEffect(() => {
    // 計算商品統計數據
    const productMap = new Map<string, { quantity: number; revenue: number }>()
    let revenue = 0
    let refund = 0

    filteredOrders.forEach((order) => {
      if (order.orderStatus === 'completed') {
        revenue += order.totalPrice

        order.items.forEach((item) => {
          const currentStats = productMap.get(item.name) || {
            quantity: 0,
            revenue: 0
          }
          const itemRevenue = item.price * item.quantity

          productMap.set(item.name, {
            quantity: currentStats.quantity + item.quantity,
            revenue: currentStats.revenue + itemRevenue
          })
        })
      } else if (order.orderStatus === 'canceled') {
        refund += order.totalPrice
      }
    })

    const statsArray = Array.from(productMap.entries()).map(
      ([name, stats]) => ({
        name,
        quantity: stats.quantity,
        revenue: stats.revenue
      })
    )

    setProductStats(statsArray)
    setTotalRevenue(revenue)
    setTotalRefund(refund)
  }, [filteredOrders])

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getFilterTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      all: '所有訂單',
      today: '今日訂單',
      month: '本月訂單',
      quarter: '本季訂單',
      year: '本年訂單'
    }
    return typeMap[type] || type
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-orange-50 min-h-screen">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          財務報表
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          查看銷售數據和財務統計
        </p>
      </div>

      <div className="mb-4 md:mb-6 flex justify-end">
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md bg-white text-gray-800 flex items-center justify-between min-w-[120px]"
          >
            <span className="text-sm sm:text-base">
              {getFilterTypeText(filterType)}
            </span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul>
                <li>
                  <button
                    onClick={() => {
                      setFilterType('all')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm sm:text-base hover:bg-orange-50 hover:text-orange-600"
                  >
                    所有訂單
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setFilterType('today')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm sm:text-base hover:bg-orange-50 hover:text-orange-600"
                  >
                    今日訂單
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setFilterType('month')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm sm:text-base hover:bg-orange-50 hover:text-orange-600"
                  >
                    本月訂單
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setFilterType('quarter')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm sm:text-base hover:bg-orange-50 hover:text-orange-600"
                  >
                    本季訂單
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setFilterType('year')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm sm:text-base hover:bg-orange-50 hover:text-orange-600"
                  >
                    本年訂單
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base md:text-lg font-medium text-gray-800">
            訂單總數
          </h2>
          <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
            {filteredOrders.length}
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base md:text-lg font-medium text-gray-800">
            總收益
          </h2>
          <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 sm:col-span-2 md:col-span-1">
          <h2 className="text-base md:text-lg font-medium text-gray-800">
            退款金額
          </h2>
          <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
            ${totalRefund.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            商品銷售統計(已完成的訂單報表)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  商品名稱
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  銷售數量
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  銷售收益
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productStats.length > 0 ? (
                productStats.map((product, index) => (
                  <tr key={index}>
                    <td className="px-3 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      ${product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 sm:px-4 md:px-6 py-2 md:py-4 text-center text-xs sm:text-sm text-gray-500"
                  >
                    無銷售數據
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
