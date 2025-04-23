"use client";

type Order = {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
  items?: { productName: string; productId: string; quantity: number }[];
};

type RecentOrdersProps = {
  orders: Order[];
  loading: boolean;
};

export function RecentOrders({ orders, loading }: RecentOrdersProps) {
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
      default:
        return "bg-red-100 text-red-500";
    }
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
                <span className="text-sm font-medium text-gray-500">{order.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {order.items && order.items.length > 1 ? (
                    <div>
                      <p className="font-medium mb-1">商品列表：</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.productName || `商品 ${item.productId.substring(0, 8)}`} 
                            <span className="text-gray-500">x {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-500 mt-1">總數量: {order.quantity}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{order.product}</p>
                      <p className="text-sm text-gray-500">數量: {order.quantity}</p>
                    </div>
                  )}
                </div>
                <p className="font-bold text-orange-500">NT$ {order.amount.toFixed(2)}</p>
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