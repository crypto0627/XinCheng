"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOrderStore, TimeRange } from "@/stores/useOrderStore";
import * as authService from "@/services/auth.service";

type Order = {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
};

type Product = {
  name: string;
  sales: number;
  revenue: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user, token, logout } = useAuthStore();
  const [timeRange, setTimeRange] = useState<TimeRange>("今日");
  
  // 使用訂單狀態存儲
  const { 
    fetchOrderStats, 
    fetchOrders, 
    fetchRevenueData, 
    loading,
    orderStats
  } = useOrderStore();
  
  // 格式化訂單數據
  const [orders, setOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push("/");
      return;
    }
    
    const fetchDashboardData = async () => {
      if (!token) return;

      // 獲取訂單統計數據
      await fetchOrderStats(timeRange, token);
      
      // 獲取最近訂單
      const ordersData = await fetchOrders(1, 4, token);
      if (ordersData && ordersData.length > 0) {
        const formattedOrders = ordersData.map(order => ({
          id: order.id,
          product: order.items && order.items[0] ? order.items[0].productName : "未知商品",
          quantity: order.totalQuantity || 0,
          amount: parseFloat(order.totalAmount) || 0,
          status: order.status === "processing" ? "待出貨" : 
                 order.status === "completed" ? "已完成" : "已取消"
        }));
        setOrders(formattedOrders);
      }
      
      // 獲取熱銷商品數據
      const revenueResult = await fetchRevenueData("all", token);
      if (revenueResult && revenueResult.popularProducts) {
        const popularProducts = revenueResult.popularProducts.map(product => ({
          name: product.productName,
          sales: product.quantity || 0,
          revenue: parseFloat(product.revenue) || 0
        }));
        setTopProducts(popularProducts);
      }
    };
    
    fetchDashboardData();
  }, [isLoggedIn, router, timeRange, token, fetchOrderStats, fetchOrders, fetchRevenueData]);

  const handleLogout = async () => {
    try {
      await authService.logout(token || undefined);
      logout();
      
      // 成功登出後重置訂單存儲
      useOrderStore.getState().resetStore();
      
      router.push("/");
    } catch (error) {
      console.error("登出錯誤:", error);
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const getTotalAmount = () => {
    return orders.reduce((total, order) => total + order.amount, 0);
  };

  if (!isLoggedIn || !user) {
    return null; // Will redirect in the useEffect
  }

  // 獲取當前時間範圍的訂單統計
  const currentStats = orderStats[timeRange] || { total: 0, pending: 0, completed: 0, cancelled: 0 };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航欄 */}
      <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="font-bold text-orange-500 text-xl">儀表板</h1>
        <button
          onClick={handleLogout}
          className="bg-orange-100 text-orange-500 px-3 py-1 rounded-md text-sm font-medium"
        >
          登出
        </button>
      </div>
      
      <div className="p-4">
        {/* 時間範圍選擇器 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {(["今日", "本週", "本月"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  timeRange === range
                    ? "bg-orange-500 text-white"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">總訂單數</p>
              {loading.orderStats ? (
                <p className="text-2xl font-bold text-orange-500">載入中...</p>
              ) : (
                <p className="text-2xl font-bold text-orange-500">{currentStats.total}</p>
              )}
            </div>
            
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-orange-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">待出貨</p>
                <p className="text-lg font-bold text-orange-500">
                  {loading.orderStats ? "..." : currentStats.pending}
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">已完成</p>
                <p className="text-lg font-bold text-green-500">
                  {loading.orderStats ? "..." : currentStats.completed}
                </p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">已取消</p>
                <p className="text-lg font-bold text-red-500">
                  {loading.orderStats ? "..." : currentStats.cancelled}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 訂單資訊 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">訂單資訊</h2>
          
          {loading.orders ? (
            <p className="text-center py-4 text-gray-500">載入中...</p>
          ) : orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">{order.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "待出貨" ? "bg-orange-100 text-orange-500" :
                      order.status === "已完成" ? "bg-green-100 text-green-500" :
                      "bg-red-100 text-red-500"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{order.product}</p>
                      <p className="text-sm text-gray-500">數量: {order.quantity}</p>
                    </div>
                    <p className="font-bold text-orange-500">NT$ {order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">暫無訂單資料</p>
          )}
          
          {orders.length > 0 && (
            <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-3">
              <p className="font-medium">總金額</p>
              <p className="font-bold text-lg text-orange-500">NT$ {getTotalAmount()}</p>
            </div>
          )}
        </div>
        
        {/* 熱銷商品排行 */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">熱銷商品排行</h2>
          
          {loading.revenue ? (
            <p className="text-center py-4 text-gray-500">載入中...</p>
          ) : topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    index < 3 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
                  } mr-3 font-bold text-sm`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">銷售量: {product.sales} 件</p>
                  </div>
                  <p className="font-bold text-orange-500">NT$ {product.revenue}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">暫無商品銷售數據</p>
          )}
        </div>
      </div>
    </div>
  );
} 