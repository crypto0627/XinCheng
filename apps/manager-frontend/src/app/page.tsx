'use client'
import { OrderService } from "@/api";
import { OrderFilter } from "@/utils/filterDate";
import { useEffect, useState } from "react";
import { Order } from "../types";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [popularItem, setPopularItem] = useState("");
  const [orderFilter, setOrderFilter] = useState<OrderFilter | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterType, setFilterType] = useState<"today" | "month" | "quarter" | "year">("today");
    
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getAllOrders();
        setOrders(data);
        
        const newFilter = new OrderFilter(data);
        setOrderFilter(newFilter);

        const revenue = data.reduce((sum: number, order: Order) => sum + order.totalPrice, 0);
        setTotalRevenue(revenue);

        const itemCounts = data.flatMap((order: Order) => order.items)
          .reduce((acc: {[key: string]: number}, item: { name: string; quantity: number }) => {
            acc[item.name] = (acc[item.name] || 0) + item.quantity;
            return acc;
          }, {});
        const mostPopular = Object.entries(itemCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
        setPopularItem(mostPopular);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [])

  useEffect(() => {
    if (!orderFilter) return;
    switch (filterType) {
        case "today":
            setFilteredOrders(orderFilter.filterByToday());
            break;
        case "month":
            setFilteredOrders(orderFilter.filterByMonth());
            break;
        case "quarter":
            setFilteredOrders(orderFilter.filterByQuarter());
            break;
        case "year":
            setFilteredOrders(orderFilter.filterByYear());
            break;
        default:
            setFilteredOrders([]);
    }
  }, [filterType, orderFilter])

  const getOrderStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusText = (status: string) => {
    const statusMap: {[key: string]: string} = {
      pending: '待處理',
      confirmed: '已確認',
      shipped: '配送中',
      delivered: '已送達',
      canceled: '已取消'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 bg-orange-50">
        <main className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800">歡迎使用星橙輕食餐盒管理系統</h1>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">總訂單</h2>
              <p className="mt-2 text-3xl font-bold text-orange-600">
                {orders.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">今日訂單</h2>
              <p className="mt-2 text-3xl font-bold text-orange-600">
                {orders.filter(order => 
                  new Date(order.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">本月營收</h2>
              <p className="mt-2 text-3xl font-bold text-orange-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">熱門商品</h2>
              <p className="mt-2 text-xl font-bold text-orange-600">
                {popularItem}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">訂單列表</h1>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as any)}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-800"
              >
                <option value="today">今日訂單</option>
                <option value="month">本月訂單</option>
                <option value="quarter">本季訂單</option>
                <option value="year">本年訂單</option>
              </select>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訂單編號</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客戶資訊</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訂單內容</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建立時間</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.name}</div>
                            <div className="text-sm text-gray-500">{order.phone}</div>
                            <div className="text-sm text-gray-500">{order.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {order.items.map((item, index) => (
                                <div key={index}>
                                  {item.name} x {item.quantity}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.totalPrice.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                              {getOrderStatusText(order.orderStatus)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.createdAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  此時段尚無訂單
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
