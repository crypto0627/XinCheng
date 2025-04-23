"use client";

type Product = {
  name: string;
  sales: number;
  revenue: number;
};

type TopProductsProps = {
  products: Product[];
  loading: boolean;
};

export function TopProducts({ products, loading }: TopProductsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3">熱銷商品排行</h2>
      
      {loading ? (
        <div className="py-8 text-center text-gray-500">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mb-2"></div>
          <p>載入中...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="space-y-3">
          {products.map((product, index) => (
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
              <p className="font-bold text-orange-500">NT$ {product.revenue.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">暫無商品銷售數據</p>
      )}
    </div>
  );
} 