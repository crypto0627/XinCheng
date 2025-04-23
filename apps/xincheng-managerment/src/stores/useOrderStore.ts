import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as orderService from '@/services/order.service';

// 定義類型
export type TimeRange = "今日" | "本週" | "本月" | "本季" | "本年" | "all";

export type OrderStats = {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
};

// 定義訂單項目的詳細類型
export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: string | number;
};

export type OrderWithItems = {
  id: string;
  userId: string;
  totalAmount: string;
  totalQuantity: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items?: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type PopularProduct = {
  productId: string;
  productName: string;
  quantity: number;
  revenue: string;
};

export type RevenueData = {
  timeRange: string;
  stats: {
    total: number;
    totalRevenue: string;
    dailyAverage: string;
  };
  popularProducts: PopularProduct[];
};

export type OrderStoreState = {
  // 訂單統計數據
  orderStats: Record<TimeRange, OrderStats | null>;
  // 訂單列表（分頁）
  orders: OrderWithItems[];
  // 訂單詳情緩存
  orderDetails: Record<string, OrderWithItems | null>;
  // 收益數據
  revenueData: Record<TimeRange, RevenueData | null>;
  // 加載狀態
  loading: {
    orderStats: boolean;
    orders: boolean;
    orderDetails: boolean;
    revenue: boolean;
  };
  // 分頁信息
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  // 最後更新時間
  lastUpdated: Record<string, number>;
  // 緩存有效期（毫秒）
  cacheDuration: number;

  // 操作方法
  fetchOrderStats: (timeRange: TimeRange, token: string) => Promise<OrderStats | null>;
  fetchOrders: (page: number, limit: number, token: string) => Promise<OrderWithItems[]>;
  fetchOrderDetails: (orderId: string, token: string) => Promise<OrderWithItems | null>;
  fetchRevenueData: (timeRange: TimeRange, token: string) => Promise<RevenueData | null>;
  updateOrderStatus: (orderId: string, status: string, token: string) => Promise<boolean>;
  resetStore: () => void;
  isCacheValid: (key: string) => boolean;
};

// 創建store
export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orderStats: {
        "今日": null,
        "本週": null,
        "本月": null,
        "本季": null,
        "本年": null,
        "all": null,
      },
      orders: [],
      orderDetails: {},
      revenueData: {
        "今日": null,
        "本週": null,
        "本月": null,
        "本季": null,
        "本年": null,
        "all": null,
      },
      loading: {
        orderStats: false,
        orders: false,
        orderDetails: false,
        revenue: false,
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
      lastUpdated: {},
      cacheDuration: 5 * 60 * 1000, // 5分鐘緩存

      // 檢查緩存是否有效
      isCacheValid: (key: string) => {
        const { lastUpdated, cacheDuration } = get();
        const lastUpdate = lastUpdated[key];
        
        if (!lastUpdate) return false;
        
        const now = Date.now();
        return (now - lastUpdate) < cacheDuration;
      },

      // 獲取訂單統計
      fetchOrderStats: async (timeRange: TimeRange, token: string) => {
        const cacheKey = `orderStats_${timeRange}`;
        
        // 如果緩存有效，直接返回
        if (get().isCacheValid(cacheKey) && get().orderStats[timeRange]) {
          return get().orderStats[timeRange];
        }
        
        set(state => ({
          loading: { ...state.loading, orderStats: true }
        }));
        
        try {
          // 首先從收入API獲取已完成訂單的數據
          const revenueResponse = await orderService.getRevenue(timeRange, token);
          
          // 然後獲取所有訂單來計算不同狀態的訂單數量
          const ordersResponse = await orderService.getAllOrders(1, 100, token);
          
          let stats: OrderStats = {
            total: 0,
            pending: 0,
            completed: 0,
            cancelled: 0
          };
          
          // 處理收入數據
          if (revenueResponse && !revenueResponse.error && revenueResponse.data) {
            const revenueData = revenueResponse.data;
            // 設置已完成訂單數量
            stats.completed = revenueData.stats?.total || 0;
          }
          
          // 處理訂單列表數據
          if (ordersResponse && !ordersResponse.error && ordersResponse.data) {
            const orders = ordersResponse.data.orders || [];
            
            // 計算不同狀態的訂單數量
            let pendingCount = 0;
            let completedCount = 0;
            let cancelledCount = 0;
            
            orders.forEach((order: OrderWithItems) => {
              if (order.status === 'processing') {
                pendingCount++;
              } else if (order.status === 'completed') {
                completedCount++;
              } else if (order.status === 'cancelled') {
                cancelledCount++;
              }
            });
            
            // 更新訂單統計
            stats = {
              total: orders.length,
              pending: pendingCount,
              completed: completedCount,
              cancelled: cancelledCount
            };
          }
          
          set(state => ({
            orderStats: { 
              ...state.orderStats, 
              [timeRange]: stats 
            },
            lastUpdated: { 
              ...state.lastUpdated, 
              [cacheKey]: Date.now() 
            }
          }));
          
          return stats;
        } catch (error) {
          console.error(`Error fetching order stats for ${timeRange}:`, error);
          return null;
        } finally {
          set(state => ({
            loading: { ...state.loading, orderStats: false }
          }));
        }
      },

      // 獲取訂單列表
      fetchOrders: async (page: number, limit: number, token: string) => {
        const cacheKey = `orders_${page}_${limit}`;
        
        // 如果緩存有效且頁碼相同，直接返回
        if (get().isCacheValid(cacheKey) && 
            get().pagination.currentPage === page && 
            get().pagination.itemsPerPage === limit &&
            get().orders.length > 0) {
          return get().orders;
        }
        
        set(state => ({
          loading: { ...state.loading, orders: true }
        }));
        
        try {
          const response = await orderService.getAllOrders(page, limit, token);
          
          if (response && !response.error && response.data) {
            const { orders: fetchedOrders, pagination } = response.data;
            
            set(state => ({
              orders: fetchedOrders || [],
              pagination: pagination || {
                currentPage: page,
                totalPages: 1,
                totalItems: fetchedOrders?.length || 0,
                itemsPerPage: limit
              },
              lastUpdated: { 
                ...state.lastUpdated, 
                [cacheKey]: Date.now() 
              }
            }));
            
            return fetchedOrders || [];
          }
          return [];
        } catch (error) {
          console.error(`Error fetching orders:`, error);
          return [];
        } finally {
          set(state => ({
            loading: { ...state.loading, orders: false }
          }));
        }
      },

      // 獲取訂單詳情
      fetchOrderDetails: async (orderId: string, token: string) => {
        const cacheKey = `orderDetails_${orderId}`;
        
        // 如果緩存有效，直接返回
        if (get().isCacheValid(cacheKey) && get().orderDetails[orderId]) {
          return get().orderDetails[orderId];
        }
        
        set(state => ({
          loading: { ...state.loading, orderDetails: true }
        }));
        
        try {
          const response = await orderService.getOrderDetails(orderId, token);
          
          if (response && !response.error && response.data) {
            const orderDetail = response.data;
            
            set(state => ({
              orderDetails: { 
                ...state.orderDetails, 
                [orderId]: orderDetail 
              },
              lastUpdated: { 
                ...state.lastUpdated, 
                [cacheKey]: Date.now() 
              }
            }));
            
            return orderDetail;
          }
          return null;
        } catch (error) {
          console.error(`Error fetching order details for ${orderId}:`, error);
          return null;
        } finally {
          set(state => ({
            loading: { ...state.loading, orderDetails: false }
          }));
        }
      },

      // 獲取收益數據
      fetchRevenueData: async (timeRange: TimeRange, token: string) => {
        const cacheKey = `revenueData_${timeRange}`;
        
        // 如果緩存有效，直接返回
        if (get().isCacheValid(cacheKey) && get().revenueData[timeRange]) {
          return get().revenueData[timeRange];
        }
        
        set(state => ({
          loading: { ...state.loading, revenue: true }
        }));
        
        try {
          const response = await orderService.getRevenue(timeRange, token);
          
          if (response && !response.error && response.data) {
            const revenueData = response.data;
            
            set(state => ({
              revenueData: { 
                ...state.revenueData, 
                [timeRange]: revenueData 
              },
              lastUpdated: { 
                ...state.lastUpdated, 
                [cacheKey]: Date.now() 
              }
            }));
            
            return revenueData;
          }
          return null;
        } catch (error) {
          console.error(`Error fetching revenue data for ${timeRange}:`, error);
          return null;
        } finally {
          set(state => ({
            loading: { ...state.loading, revenue: false }
          }));
        }
      },

      // 更新訂單狀態
      updateOrderStatus: async (orderId: string, status: string, token: string) => {
        try {
          const response = await orderService.updateOrderStatus(orderId, status, token);
          
          if (response && !response.error) {
            // 更新訂單狀態後，清除相關緩存
            set(state => {
              // 創建新的緩存對象
              const newOrderDetails = { ...state.orderDetails };
              // 移除當前訂單的緩存
              delete newOrderDetails[orderId];
              
              // 清除所有可能受影響的緩存時間戳
              const newLastUpdated = { ...state.lastUpdated };
              Object.keys(newLastUpdated).forEach(key => {
                if (key.startsWith('orders_') || 
                    key.startsWith('orderStats_') ||
                    key.startsWith('revenueData_')) {
                  delete newLastUpdated[key];
                }
              });
              
              return {
                orderDetails: newOrderDetails,
                lastUpdated: newLastUpdated
              };
            });
            
            return true;
          }
          return false;
        } catch (error) {
          console.error(`Error updating order status for ${orderId}:`, error);
          return false;
        }
      },

      // 重設Store
      resetStore: () => {
        set({
          orderStats: {
            "今日": null,
            "本週": null,
            "本月": null,
            "本季": null,
            "本年": null,
            "all": null,
          },
          orders: [],
          orderDetails: {},
          revenueData: {
            "今日": null,
            "本週": null,
            "本月": null,
            "本季": null,
            "本年": null,
            "all": null,
          },
          lastUpdated: {},
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          },
        });
      }
    }),
    {
      name: 'order-store',
      // 僅持久化部分數據，排除loading狀態和方法
      partialize: (state) => ({
        orderStats: state.orderStats,
        orders: state.orders,
        orderDetails: state.orderDetails,
        revenueData: state.revenueData,
        pagination: state.pagination,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
); 