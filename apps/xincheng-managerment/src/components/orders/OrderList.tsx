"use client";

import { useState } from "react";
import { OrderWithItems } from "@/stores/useOrderStore";

type OrderListProps = {
  orders: OrderWithItems[];
  loading: boolean;
  onStatusChange: (orderId: string, status: string) => void;
  statusOptions: { label: string; value: string }[];
  formatPrice: (price: string | number) => string;
};

export function OrderList({
  orders,
  loading,
  onStatusChange,
  statusOptions,
  formatPrice,
}: OrderListProps) {
  // 獲取訂單狀態標籤
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return "處理中";
      case 'completed': return "已完成";
      case 'cancelled': return "已取消";
      default: return status;
    }
  };
  
  // 獲取訂單狀態類別
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'processing': return "bg-orange-100 text-orange-600";
      case 'completed': return "bg-green-100 text-green-600";
      case 'cancelled': return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };
  
  // 狀態下拉選單
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (orderId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleStatusSelect = (orderId: string, status: string) => {
    onStatusChange(orderId, status);
    toggleDropdown(orderId);
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mb-2"></div>
        <p>載入中...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>暫無訂單資料</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              訂單編號
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              客戶資訊
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              商品
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              金額
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              訂單日期
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              狀態
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {order.user ? (
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                    <div className="text-sm text-gray-500">{order.user.email}</div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">無客戶資訊</span>
                )}
              </td>
              <td className="px-6 py-4">
                {order.items && order.items.length > 0 ? (
                  <div className="max-h-24 overflow-y-auto text-sm">
                    <ul className="list-disc pl-5">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="mb-1">
                          {item.productName || `商品 ${item.productId.substring(0, 8)}`}
                          <span className="text-gray-500"> x {item.quantity}</span>
                          <span className="ml-2 text-orange-500">${formatPrice(item.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">無商品資訊</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-500">
                ${formatPrice(order.totalAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.createdAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="relative">
                  <div 
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm cursor-pointer flex justify-between items-center min-w-[90px]"
                    onClick={() => toggleDropdown(order.id)}
                  >
                    <span>{getStatusLabel(order.status)}</span>
                    <svg 
                      className={`w-4 h-4 ml-1 transition-transform ${openDropdowns[order.id] ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  
                  {openDropdowns[order.id] && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                      {statusOptions.map((option) => (
                        <div 
                          key={option.value} 
                          className={`px-2 py-1 text-sm cursor-pointer hover:bg-orange-50 ${order.status === option.value ? 'bg-orange-100 text-orange-600' : ''}`}
                          onClick={() => handleStatusSelect(order.id, option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 