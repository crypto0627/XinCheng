export interface User {
  id: string;
  username: string;
  email: string;
  password_hash?: string;
  created_at: string;
}

export interface Product {
  id: string;
  product_name: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_email_snapshot: string;
  total_price: number;
  status: 'processing' | 'completed' | 'cancelled';
  created_at: string;
  completed_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  price_snapshot: number;
  quantity: number;
  subtotal: number;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  updated_at: number;
}

export interface ResetToken {
  user_id: string;
  email: string;
  expires_at: number;
}
