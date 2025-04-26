"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOrderStore, TimeRange } from "@/stores/useOrderStore";
import * as authService from "@/services/auth.service";
import { checkAuthAndRedirect } from "@/utils/auth";

// 導入組件
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TopProducts } from "@/components/dashboard/TopProducts";

// 類型定義
type Order = {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
  items?: { productName: string; productId: string; quantity: number }[];
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
    
    // 檢查用戶權限
    if (checkAuthAndRedirect(user, router)) {
      return;
    }
    
    const fetchDashboardData = async () => {
      if (!token) return;

      // 獲取訂單統計數據
      await fetchOrderStats(timeRange, token);
      
      // 獲取最近訂單
      const ordersData = await fetchOrders(1, 4, token);
      if (ordersData && ordersData.length > 0) {
        const formattedOrders = ordersData.map(order => {
          // 取得訂單中的商品資訊
          let productInfo = "未知商品";
          let productQuantity = 0;
          
          // 檢查訂單項目是否存在
          if (order.items && order.items.length > 0) {
            // 如果只有一個商品，直接顯示商品名稱
            if (order.items.length === 1) {
              const item = order.items[0];
              productInfo = item.productName || `商品 ${item.productId}`;
              productQuantity = item.quantity || 0;
            } 
            // 如果有多個商品，顯示所有商品
            else {
              // 將多個商品格式化為適合在UI中顯示的格式
              productInfo = order.items.map(item => 
                `${item.productName || `商品 ${item.productId.substring(0, 8)}`} x ${item.quantity}`
              ).join('\n');
              productQuantity = order.totalQuantity || 0;
            }
          }
          
          return {
            id: order.id,
            product: productInfo,
            quantity: productQuantity,
            amount: parseFloat(order.totalAmount) || 0,
            status: order.status === "processing" ? "待出貨" : 
                  order.status === "completed" ? "已完成" : "已取消",
            items: order.items
          };
        });
        setOrders(formattedOrders);
      }
      
      // 獲取熱銷商品數據
      const revenueResult = await fetchRevenueData("all", token);
      if (revenueResult && revenueResult.popularProducts) {
        const popularProducts = revenueResult.popularProducts.map(product => ({
          name: product.productName || `商品 ${product.productId.substring(0, 8)}`,
          sales: product.quantity || 0,
          revenue: parseFloat(product.revenue) || 0
        }));
        setTopProducts(popularProducts);
      }
    };
    
    fetchDashboardData();
  }, [isLoggedIn, router, timeRange, token, fetchOrderStats, fetchOrders, fetchRevenueData, user]);

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

  if (!isLoggedIn || !user) {
    return null; // Will redirect in the useEffect
  }

  // 再次檢查權限（防止直接載入）
  if (checkAuthAndRedirect(user, router)) {
    return null;
  }

  // 獲取當前時間範圍的訂單統計
  const currentStats = orderStats[timeRange] || null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航欄 */}
      <DashboardHeader onLogout={handleLogout} />
      
      <div className="p-4">
        {/* 時間範圍選擇器和訂單統計 */}
        <TimeRangeSelector 
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          loading={loading.orderStats}
          orderStats={currentStats}
        />
        
        {/* 訂單資訊 */}
        <RecentOrders 
          orders={orders}
          loading={loading.orders}
        />
        
        {/* 熱銷商品排行 */}
        <TopProducts 
          products={topProducts}
          loading={loading.revenue}
        />
      </div>
    </div>
  );
}