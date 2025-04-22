import { drizzle } from "drizzle-orm/d1";

// Define DrizzleInstance type based on the return type of drizzle function
export type DrizzleInstance = ReturnType<typeof drizzle>;

// Define types for order items and order data
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  email: string;
  items: OrderItem[];
  totalAmount: number;
  totalQuantity: number;
  paymentMethod: string;
}