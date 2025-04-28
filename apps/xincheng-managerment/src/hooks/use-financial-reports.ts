"use client"

import { useState, useEffect } from "react"
import { useOrderStore } from "@/stores/useOrderStore"
import type { FinancialData, Transaction, Order } from "@/types"

export function useFinancialReports(timeRange: string, token: string | null) {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { fetchOrders, orders, isLoading: ordersLoading } = useOrderStore()

  // Filter orders based on time range
  const filterOrdersByTimeRange = (orders: Order[], timeRange: string) => {
    const now = new Date()
    
    return orders.filter(order => {
      if (!order.createdAt) return false
      
      // Parse the order date format "YYYY/MM/DD 上午/下午HH:MM"
      const dateComponents = order.createdAt.split(' ')
      if (dateComponents.length !== 2) return false
      
      const [datePart, timePart] = dateComponents
      const [year, month, day] = datePart.split('/').map(Number)
      
      const hourStr = timePart.substring(2) // Remove '上午' or '下午'
      let hour = parseInt(hourStr.split(':')[0], 10)
      const minute = parseInt(hourStr.split(':')[1], 10)
      
      // Adjust hour
      if (timePart.startsWith('下午') && hour !== 12) {
        hour += 12
      }
      if (timePart.startsWith('上午') && hour === 12) {
        hour = 0
      }
      
      const orderDate = new Date(year, month - 1, day, hour, minute)
      
      switch (timeRange) {
        case "今日":
          return (
            orderDate.getDate() === now.getDate() &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          )
        case "本週":
          const startOfWeek = new Date(now)
          startOfWeek.setDate(now.getDate() - now.getDay())
          startOfWeek.setHours(0, 0, 0, 0)
          return orderDate >= startOfWeek
        case "本月":
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          )
        case "本季":
          const currentQuarter = Math.floor(now.getMonth() / 3)
          const startMonth = currentQuarter * 3
          return (
            orderDate.getMonth() >= startMonth &&
            orderDate.getMonth() < startMonth + 3 &&
            orderDate.getFullYear() === now.getFullYear()
          )
        case "本年":
          return orderDate.getFullYear() === now.getFullYear()
        case "所有":
          return true
        default:
          return true
      }
    })
  }

  useEffect(() => {
    if (!token) return

    const loadOrders = async () => {
      setIsLoading(true)
      try {
        await fetchOrders(1, 100, token) // Fetch a larger number to have enough for analysis
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    loadOrders()
  }, [token, fetchOrders])

  useEffect(() => {
    if (ordersLoading) {
      setIsLoading(true)
      return
    }

    // Filter orders by time range
    const filteredOrders = filterOrdersByTimeRange(orders, timeRange)
    
    // Calculate financial data from real orders
    if (filteredOrders.length > 0) {
      // Calculate total sales
      const totalSales = filteredOrders.reduce((sum, order) => 
        sum + parseFloat(order.totalAmount || '0'), 0)
      
      // Count cancelled orders (treat as refunds)
      const cancelledOrders = filteredOrders.filter(order => 
        order.status === 'cancelled' || order.status === '已取消')
      
      const totalRefunds = cancelledOrders.reduce((sum, order) => 
        sum + parseFloat(order.totalAmount || '0'), 0)
      
      // Calculate net revenue
      const netRevenue = totalSales - totalRefunds
      
      // Calculate average order value
      const averageOrderValue = filteredOrders.length > 0 
        ? totalSales / filteredOrders.length 
        : 0
      
      // Calculate refund rate
      const refundRate = totalSales > 0 
        ? (totalRefunds / totalSales) * 100 
        : 0
      
      // Set some reasonable assumptions for the data we don't have
      const grossMargin = 30 // 30% profit margin as a placeholder
      const operatingCosts = netRevenue * 0.7 // 70% of revenue goes to costs as a placeholder
      
      const calculatedFinancialData: FinancialData = {
        totalSales,
        totalRefunds,
        netRevenue,
        transactionCount: filteredOrders.length,
        averageOrderValue,
        refundRate,
        grossMargin,
        operatingCosts
      }
      
      setFinancialData(calculatedFinancialData)
      
      // Convert orders to transactions format for the table
      const orderTransactions: Transaction[] = filteredOrders.map(order => ({
        id: order.id,
        customer: order.user ? `${order.user.name}` : 'Unknown Customer',
        amount: parseFloat(order.totalAmount || '0'),
        status: order.status === 'processing' ? '處理中' : 
                order.status === 'completed' ? '已完成' : 
                order.status === 'cancelled' ? '已退款' : order.status,
        date: order.createdAt || '',
        items: order.items // Include order items in the transaction data
      }))
      
      setTransactions(orderTransactions)
    } else {
      // No orders found for the time range
      setFinancialData({
        totalSales: 0,
        totalRefunds: 0,
        netRevenue: 0,
        transactionCount: 0,
        averageOrderValue: 0,
        refundRate: 0,
        grossMargin: 0,
        operatingCosts: 0
      })
      setTransactions([])
    }
    
    setIsLoading(false)
  }, [orders, ordersLoading, timeRange])

  return {
    financialData,
    transactions,
    isLoading,
  }
}
