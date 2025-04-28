"use client";

import { useState, useRef, useEffect } from "react";
import { useOrderStore } from "@/stores/useOrderStore";
import { useAuthStore } from "@/stores/useAuthStore";

type Order = {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
  createdAt?: string;
  items?: { productName: string; productId: string; quantity: number; price?: string }[];
};

type RecentOrdersProps = {
  orders: Order[];
  loading: boolean;
};

export function RecentOrders({ orders, loading }: RecentOrdersProps) {
  const { token } = useAuthStore();
  const { updateOrderStatus } = useOrderStore();
  
  // 狀態下拉選單狀態
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // 監聽點擊事件以關閉下拉式選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId && 
          dropdownRefs.current[openDropdownId] && 
          !dropdownRefs.current[openDropdownId]?.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);
  
  // 計算總金額
  const getTotalAmount = () => {
    return orders.reduce((total, order) => total + order.amount, 0).toFixed(2);
  };

  // 獲取狀態樣式
  const getStatusStyle = (status: string) => {
    switch(status) {
      case "待出貨":
        return "bg-orange-100 text-orange-500";
      case "已完成":
        return "bg-green-100 text-green-500";
      case "已取消":
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };
  
  // 更新訂單狀態
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;
    
    // 將UI狀態映射到API狀態
    const statusMap: Record<string, string> = {
      "待出貨": "processing",
      "已完成": "completed",
      "已取消": "cancelled"
    };
    
    const apiStatus = statusMap[newStatus] || newStatus;
    
    try {
      await updateOrderStatus(orderId, apiStatus, token);
      setOpenDropdownId(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // 格式化價格
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3">訂單資訊</h2>
      
      {loading ? (
        <div className="py-8 text-center text-gray-500">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mb-2"></div>
          <p>載入中...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">{order.id}</span>
                  {order.createdAt && (
                    <span className="text-xs text-gray-400">{order.createdAt}</span>
                  )}
                </div>
                
                {/* 訂單狀態下拉選單 */}
                <div 
                  className="relative" 
                  ref={el => { dropdownRefs.current[order.id] = el; }}
                >
                  <div
                    className={`cursor-pointer text-xs px-3 py-1 rounded-full ${getStatusStyle(order.status)} flex items-center gap-1`}
                    onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)}
                  >
                    <span>{order.status}</span>
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {openDropdownId === order.id && (
                    <div className="absolute right-0 z-10 mt-1 w-32 bg-white shadow-lg rounded-md border border-gray-200">
                      <ul className="py-1">
                        <li 
                          className="px-3 py-1 text-xs text-orange-500 hover:bg-orange-50 cursor-pointer"
                          onClick={() => handleStatusChange(order.id, "待出貨")}
                        >
                          待出貨
                        </li>
                        <li 
                          className="px-3 py-1 text-xs text-green-500 hover:bg-green-50 cursor-pointer"
                          onClick={() => handleStatusChange(order.id, "已完成")}
                        >
                          已完成
                        </li>
                        <li 
                          className="px-3 py-1 text-xs text-red-500 hover:bg-red-50 cursor-pointer"
                          onClick={() => handleStatusChange(order.id, "已取消")}
                        >
                          已取消
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {order.items && order.items.length > 1 ? (
                    <div>
                      <p className="font-medium mb-1">商品列表：</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <div>
                              {item.productName || `商品 ${item.productId.substring(0, 8)}`} 
                              <span className="text-gray-500 ml-1">x {item.quantity}</span>
                            </div>
                            <span className="text-orange-500 font-medium">
                              NT$ {formatPrice(Number(item.price) * item.quantity || '0')}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between mt-2">
                        <p className="text-sm text-gray-500">總數量: {order.quantity}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{order.product}</p>
                      <div className="flex space-x-4 mt-1">
                        <p className="text-sm text-gray-500">數量: {order.quantity}</p>
                      </div>
                    </div>
                  )}
                </div>
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
  );
} 