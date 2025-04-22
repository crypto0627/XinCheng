export type OrderStats = {
    total: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  
export type OrderItem = {
    id: string;
    productId: string;
    productName?: string;
    quantity: number;
    price: string;
  };
  
export type Order = {
    id: string;
    totalAmount: string;
    totalQuantity: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
  };
  
export type OrderStatusData = {
    user: {
      id: string;
      name: string;
      email: string;
    };
    stats: OrderStats;
    orders: Order[];
  };
  
export type OrdersByStatus = {
    processing: Order[];
    completed: Order[];
    cancelled: Order[];
    all: Order[];
  };