export interface FinancialData {
    totalSales: number
    totalRefunds: number
    netRevenue: number
    transactionCount: number
    averageOrderValue: number
    refundRate: number
    grossMargin: number
    operatingCosts: number
}

export interface Transaction {
    id: string
    customer: string
    amount: number
    status: string
    date: string
    items?: OrderItem[]
}

export interface OrderItem {
    id: string
    productId: string
    productName: string
    quantity: number
    price: string
}

export interface User {
    id: string
    name: string
    email: string
}

export interface Order {
    id: string
    userId: string
    totalAmount: string
    totalQuantity: number
    paymentMethod: string
    status: string
    createdAt: string
    user: User
    items: OrderItem[]
}