"use client"

import { create } from 'zustand'
import { getAllOrders, updateOrderStatus } from '@/services/order.service'
import type { Order } from '@/types'

interface OrderStore {
  orders: Order[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
  }
  isLoading: boolean
  error: string | null
  fetchOrders: (page: number, limit: number, token?: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: string, token?: string) => Promise<void>
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  pagination: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10
  },
  isLoading: false,
  error: null,

  fetchOrders: async (page = 1, limit = 10, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllOrders(page, limit, token)
      if (response.error) {
        throw new Error(response.error)
      }
      set({
        orders: response.data.orders,
        pagination: response.data.pagination,
        isLoading: false
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      })
    }
  },

  updateOrderStatus: async (orderId, status, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await updateOrderStatus(orderId, status, token)
      if (response.error) {
        throw new Error(response.error)
      }
      // 更新本地狀態中的訂單狀態
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update order status',
        isLoading: false 
      })
    }
  }
}))
