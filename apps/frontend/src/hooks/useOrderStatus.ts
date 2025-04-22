import { useState, useEffect, useMemo } from 'react';
import { orderService } from '@/services/orderService';
import { Order, OrderStatusData,OrdersByStatus } from '@/types/order-status.type';

export function useOrderStatus(email: string, initialStatus?: string) {
  // Main data state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrderStatusData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(initialStatus);
  
  // Fetch data only once and organize it by status
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus | null>(null);
  
  // Cache timeout in milliseconds (5 minutes)
  const CACHE_TIMEOUT = 5 * 60 * 1000;
  
  // Function to organize orders by their status
  const organizeOrdersByStatus = (orders: Order[]): OrdersByStatus => {
    return {
      processing: orders.filter(order => order.status === 'processing'),
      completed: orders.filter(order => order.status === 'completed'),
      cancelled: orders.filter(order => order.status === 'cancelled'),
      all: orders
    };
  };
  
  // Fetch data from API
  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const response = await orderService.monitorStatus(email);
      console.log(response.data)
      setData(response.data);
      setOrdersByStatus(organizeOrdersByStatus(response.data.orders));
      setError(null);
      setLastFetchTime(Date.now());
    } catch (err) {
      console.error('Error fetching order status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch order status');
      setData(null);
      setOrdersByStatus(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    if (!email) return;
    
    const shouldFetch = 
      !ordersByStatus || 
      Date.now() - lastFetchTime > CACHE_TIMEOUT;
    
    if (shouldFetch) {
      fetchOrderData();
    } else {
      setLoading(false);
    }
  }, [email]);

  // Apply status filter to data without refetching
  const filteredData = useMemo(() => {
    if (!data || !ordersByStatus) return null;
    
    // Deep clone the data
    const filteredData = { ...data };
    
    // Apply filter
    if (statusFilter && statusFilter !== 'all') {
      // Use cached orders for the specific status
      filteredData.orders = ordersByStatus[statusFilter as keyof typeof ordersByStatus] || [];
    } else {
      // Use all orders
      filteredData.orders = ordersByStatus.all;
    }
    
    return filteredData;
  }, [data, statusFilter, ordersByStatus]);
  
  // Manual refresh function 
  const refreshOrders = async () => {
    await fetchOrderData();
  };

  return {
    loading,
    error,
    data: filteredData,
    statusFilter,
    setStatusFilter,
    refreshOrders,
    // Expose cached data for direct access if needed
    cachedOrders: ordersByStatus
  };
} 