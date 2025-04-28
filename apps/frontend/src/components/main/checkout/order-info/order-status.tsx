import { useOrderStatus } from '@/hooks/useOrderStatus';
import { useState } from 'react';

// Define status mapping for display
const STATUS_MAP = {
  'processing': {
    label: '處理中',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400'
  },
  'completed': {
    label: '已完成',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400'
  },
  'cancelled': {
    label: '已取消',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400'
  }
};

interface OrderStatusProps {
  email: string;
  initialStatus?: string;
}

export const OrderStatus = ({ email, initialStatus }: OrderStatusProps) => {
  const {
    loading,
    error,
    data: orderData,
    statusFilter,
    setStatusFilter,
    refreshOrders,
    cachedOrders
  } = useOrderStatus(email, initialStatus);

  const handleFilterChange = (status: string | undefined) => {
    setStatusFilter(status);
  };

  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  };

  if (loading && !cachedOrders) {
    return <div className="p-4 text-center">Loading order information...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-3">{error}</p>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={refreshing}
          aria-label='loading'
        >
          {refreshing ? '加載中...' : '重新加載'}
        </button>
      </div>
    );
  }

  if (!orderData) {
    return <div className="p-4 text-center">No order information found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">訂單狀態</h2>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={refreshing}
          aria-label='loading'
        >
          {refreshing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              刷新中...
            </span>
          ) : '刷新'}
        </button>
      </div>
      
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">您好, {orderData.user.name}</h3>
        <p className="text-gray-700">Email: {orderData.user.email}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">訂單統計</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className={`bg-blue-100 p-3 rounded-lg text-center ${!statusFilter ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="text-2xl font-bold">{orderData.stats.total}</div>
            <div className="text-sm">總訂單</div>
          </div>
          {Object.keys(STATUS_MAP).map(status => {
            const statusInfo = STATUS_MAP[status as keyof typeof STATUS_MAP];
            const isActive = statusFilter === status;
            
            return (
              <div 
                key={status}
                className={`${statusInfo.bgColor} p-3 rounded-lg text-center cursor-pointer transition-all ${isActive ? `ring-2 ring-${status === 'processing' ? 'yellow' : status === 'completed' ? 'green' : 'red'}-500` : ''}`}
                onClick={() => handleFilterChange(isActive ? undefined : status)}
              >
                <div className="text-2xl font-bold">{orderData.stats[status as keyof typeof orderData.stats]}</div>
                <div className="text-sm">{statusInfo.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">訂單篩選</h3>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded transition-colors ${statusFilter === undefined ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => handleFilterChange(undefined)}
            aria-label='all'
          >
            全部
          </button>
          {Object.keys(STATUS_MAP).map(status => {
            const statusInfo = STATUS_MAP[status as keyof typeof STATUS_MAP];
            return (
              <button 
                key={status}
                className={`px-4 py-2 rounded transition-colors ${
                  statusFilter === status 
                    ? `${statusInfo.bgColor} ${statusInfo.color} border-2 ${statusInfo.borderColor} font-bold` 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleFilterChange(status)}
                aria-label='status-info'
              >
                {statusInfo.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {loading && (
        <div className="text-center p-2 mb-2 text-blue-600">
          <svg className="animate-spin inline-block h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          更新中...
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-2">
        訂單列表
        {statusFilter && (
          <span className={`ml-2 text-sm ${STATUS_MAP[statusFilter as keyof typeof STATUS_MAP]?.color || 'text-gray-500'}`}>
            ({STATUS_MAP[statusFilter as keyof typeof STATUS_MAP]?.label || statusFilter})
          </span>
        )}
      </h3>
      
      {orderData.orders.length === 0 ? (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          沒有找到訂單記錄
        </div>
      ) : (
        <div className="space-y-4">
          {orderData.orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status as keyof typeof STATUS_MAP] || {
              label: order.status,
              color: 'text-gray-600',
              bgColor: 'bg-gray-100',
              borderColor: 'border-gray-300'
            };
            
            return (
              <div 
                key={order.id} 
                className={`border rounded-lg p-4 bg-white shadow-sm ${
                  statusFilter === order.status ? `border-l-4 ${statusInfo.borderColor}` : ''
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">訂單編號: {order.id}</div>
                  <div className="text-sm text-gray-500">下單時間: {order.createdAt}</div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  <div>
                    <span className="text-gray-600 text-sm">總金額:</span>
                    <div className="font-bold">${order.totalAmount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">總數量:</span>
                    <div className="font-bold">{order.totalQuantity}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">付款方式:</span>
                    <div>{order.paymentMethod}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">訂單狀態:</span>
                    <div className={`font-semibold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">訂購商品</h4>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 px-2 text-sm font-medium text-gray-500">商品名稱</th>
                          <th className="text-center py-2 px-2 text-sm font-medium text-gray-500">數量</th>
                          <th className="text-right py-2 px-2 text-sm font-medium text-gray-500">單件價格</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-100">
                            <td className="py-2 px-2 font-medium">
                              {item.productName || `商品 #${item.productId.substring(0, 8)}`}
                            </td>
                            <td className="py-2 px-2 text-center">{item.quantity}</td>
                            <td className="py-2 px-2 text-right">${item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}; 