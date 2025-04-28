"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOrderStore } from "@/stores/useOrderStore";
import * as authService from "@/services/auth.service";
import { checkAuthAndRedirect } from "@/utils/auth";

// 導入組件
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RecentOrders } from "@/components/dashboard/RecentOrders";

// 類型定義
type OrderDisplay = {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
  createdAt: string;
  items?: { productName: string; productId: string; quantity: number }[];
};

type DateRange = "today" | "month" | "year" | "all";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user, token, logout } = useAuthStore();
  
  // 使用訂單狀態存儲
  const {
    fetchOrders,
    orders,
    isLoading
  } = useOrderStore();
  
  // 格式化訂單數據
  const [displayOrders, setDisplayOrders] = useState<OrderDisplay[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDisplay[]>([]);
  
  // 下拉式選單狀態
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateRange>("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  
  // 下拉選單的參照
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // 監聽點擊事件以關閉下拉式選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setShowDateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      
      try {
        // 獲取最近訂單
        await fetchOrders(1, 10, token);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    
    fetchDashboardData();
  }, [isLoggedIn, router, token, fetchOrders, user]);

  // 當訂單數據變化時，格式化訂單顯示
  useEffect(() => {
    if (orders && orders.length > 0) {
      const formattedOrders = orders.map(order => {
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
                order.status === "completed" ? "已完成" :
                order.status === "cancelled" ? "已取消" : "未知狀態",
          createdAt: order.createdAt || "",
          items: order.items
        };
      });
      setDisplayOrders(formattedOrders);
    } else {
      setDisplayOrders([]);
    }
  }, [orders]);

  // 當過濾條件變化時，重新過濾訂單
  useEffect(() => {
    if (displayOrders.length === 0) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...displayOrders];
    
    // 狀態過濾
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // 日期過濾
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(order => {
        if (!order.createdAt) return false;
        
        const orderDate = parseOrderDate(order.createdAt);
        if (!orderDate) return false;
        
        switch (dateFilter) {
          case "today":
            return isToday(orderDate, now);
          case "month":
            return isSameMonth(orderDate, now);
          case "year":
            return isSameYear(orderDate, now);
          default:
            return true;
        }
      });
    }
    
    setFilteredOrders(filtered);
  }, [displayOrders, statusFilter, dateFilter]);

  // 訂單日期解析
  const parseOrderDate = (dateString: string): Date | null => {
    // 格式如 "2025/04/28 上午05:44"
    try {
      // 分割日期和時間
      const [datePart, timePart] = dateString.split(' ');
      
      // 處理日期部分
      const [year, month, day] = datePart.split('/').map(Number);
      
      // 處理時間部分
      const hourStr = timePart.substring(2); // 去掉"上午"或"下午"
      let hour = parseInt(hourStr.split(':')[0], 10);
      const minute = parseInt(hourStr.split(':')[1], 10);
      
      // 調整小時（如果是下午且不是12點，加12小時）
      if (timePart.startsWith('下午') && hour !== 12) {
        hour += 12;
      }
      // 如果是上午12點，應該是0點
      if (timePart.startsWith('上午') && hour === 12) {
        hour = 0;
      }
      
      return new Date(year, month - 1, day, hour, minute);
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return null;
    }
  };

  // 日期比較函數
  const isToday = (date: Date, now: Date): boolean => {
    return date.getDate() === now.getDate() &&
           date.getMonth() === now.getMonth() &&
           date.getFullYear() === now.getFullYear();
  };

  const isSameMonth = (date: Date, now: Date): boolean => {
    return date.getMonth() === now.getMonth() &&
           date.getFullYear() === now.getFullYear();
  };

  const isSameYear = (date: Date, now: Date): boolean => {
    return date.getFullYear() === now.getFullYear();
  };

  // 取得日期過濾器顯示名稱
  const getDateFilterDisplay = (filter: DateRange): string => {
    switch (filter) {
      case "today": return "本日";
      case "month": return "本月";
      case "year": return "本年";
      case "all": return "所有";
      default: return "所有";
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout(token || undefined);
      logout();
      router.push("/");
    } catch (error) {
      console.error("登出錯誤:", error);
    }
  };

  if (!isLoggedIn || !user) {
    return null; // Will redirect in the useEffect
  }

  // 再次檢查權限（防止直接載入）
  if (checkAuthAndRedirect(user, router)) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航欄 */}
      <DashboardHeader onLogout={handleLogout} />
      
      <div className="p-4">
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">訂單概覽</h2>
          
          <div className="flex flex-wrap gap-4 mb-4">
            {/* 訂單狀態過濾器 */}
            <div className="relative" ref={statusDropdownRef}>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <span>訂單狀態: {statusFilter === "all" ? "全部" : statusFilter}</span>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showStatusDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                  <ul className="py-1">
                    <li 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setStatusFilter("all");
                        setShowStatusDropdown(false);
                      }}
                    >
                      全部
                    </li>
                    <li 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setStatusFilter("待出貨");
                        setShowStatusDropdown(false);
                      }}
                    >
                      待出貨
                    </li>
                    <li 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setStatusFilter("已完成");
                        setShowStatusDropdown(false);
                      }}
                    >
                      已完成
                    </li>
                    <li 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setStatusFilter("已取消");
                        setShowStatusDropdown(false);
                      }}
                    >
                      已取消
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* 日期過濾器 */}
            <div className="relative" ref={dateDropdownRef}>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowDateDropdown(!showDateDropdown)}
              >
                <span>時間範圍: {getDateFilterDisplay(dateFilter)}</span>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDateDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                  <ul className="py-1">
                    <li 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDateFilter("all");
                        setShowDateDropdown(false);
                      }}
                    >
                      所有
                    </li>
                    <li 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDateFilter("today");
                        setShowDateDropdown(false);
                      }}
                    >
                      本日
                    </li>
                    <li 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDateFilter("month");
                        setShowDateDropdown(false);
                      }}
                    >
                      本月
                    </li>
                    <li 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDateFilter("year");
                        setShowDateDropdown(false);
                      }}
                    >
                      本年
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-600">
            共找到 {filteredOrders.length} 筆訂單
          </p>
        </div>

        {/* 訂單資訊 - 使用過濾後的訂單 */}
        <RecentOrders 
          orders={filteredOrders}
          loading={isLoading}
        />
      </div>
    </div>
  );
}