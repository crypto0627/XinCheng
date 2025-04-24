"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOrderStore, TimeRange, OrderWithItems } from "@/stores/useOrderStore";
import { checkAuthAndRedirect } from "@/utils/auth";
import { FullScreenLoading } from "@/components/ui/loading";
import { OrderList } from "@/components/orders/OrderList";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { Pagination } from "@/components/ui/pagination";

// 時間範圍選項
const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: "本日", value: "今日" },
  { label: "本週", value: "本週" },
  { label: "本月", value: "本月" },
  { label: "本季", value: "本季" },
  { label: "本年", value: "本年" },
  { label: "所有", value: "all" },
];

// 狀態選項
const STATUS_OPTIONS = [
  { label: "處理中", value: "processing" },
  { label: "已完成", value: "completed" },
  { label: "已取消", value: "cancelled" },
];

function OrderListContent() {
  const router = useRouter();
  const { isLoggedIn, user, token } = useAuthStore();
  
  // 使用訂單狀態存儲
  const { 
    fetchOrders,
    fetchOrderStats,
    updateOrderStatus: updateOrderStatusStore,
    loading,
    orders,
    pagination
  } = useOrderStore();
  
  // 狀態
  const [timeRange, setTimeRange] = useState<TimeRange>("今日");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithItems[]>([]);
  
  // 載入訂單資料
  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push("/");
      return;
    }
    
    // 檢查用戶權限
    if (checkAuthAndRedirect(user, router)) {
      return;
    }
    
    const loadOrders = async () => {
      await fetchOrders(currentPage, 20, token);
      await fetchOrderStats(timeRange, token);
    };
    
    loadOrders();
  }, [isLoggedIn, token, currentPage, timeRange, fetchOrders, fetchOrderStats, router, user]);
  
  // 過濾訂單
  useEffect(() => {
    if (!orders) return;
    
    let filtered = [...orders];
    
    // 根據狀態過濾
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [orders, statusFilter]);
  
  // 更新訂單狀態
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;
    
    const success = await updateOrderStatusStore(orderId, newStatus, token);
    if (success) {
      // 重新獲取訂單
      await fetchOrders(currentPage, 20, token);
      await fetchOrderStats(timeRange, token);
    }
  };
  
  // 處理時間範圍變更
  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
  };
  
  // 處理狀態過濾變更
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  // 處理頁面變更
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // 格式化價格
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };
  
  if (!isLoggedIn || !user) {
    return null; // 將在 useEffect 中重定向
  }
  
  // 再次檢查權限（防止直接載入）
  if (checkAuthAndRedirect(user, router)) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航欄 */}
      <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="font-bold text-orange-500 text-xl">訂單管理</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-orange-100 text-orange-500 px-3 py-1 rounded-md text-sm font-medium"
          aria-label='back-to-dashboard'
        >
          返回儀表板
        </button>
      </div>
      
      <div className="p-4">
        {/* 篩選控制區 */}
        <OrderFilters 
          timeRange={timeRange}
          statusFilter={statusFilter}
          onTimeRangeChange={handleTimeRangeChange}
          onStatusFilterChange={handleStatusFilterChange}
          timeRangeOptions={TIME_RANGES}
          statusOptions={STATUS_OPTIONS}
        />
        
        {/* 訂單列表 */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">訂單列表</h2>
          
          <OrderList 
            orders={filteredOrders}
            loading={loading.orders}
            onStatusChange={handleStatusChange}
            statusOptions={STATUS_OPTIONS}
            formatPrice={formatPrice}
          />
          
          {/* 分頁控制 */}
          {pagination && (
            <Pagination 
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemCount={filteredOrders.length}
              onPageChange={handlePageChange}
              isLoading={loading.orders}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 使用Suspense包裝主頁面
export default function OrderListPage() {
  return (
    <Suspense fallback={<FullScreenLoading message="載入訂單列表..." />}>
      <OrderListContent />
    </Suspense>
  );
}
