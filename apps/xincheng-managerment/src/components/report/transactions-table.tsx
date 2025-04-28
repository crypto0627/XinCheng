"use client"
import { useState, Fragment } from "react"
import { ArrowUpDown, ChevronDown, ChevronRight, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/types"

interface TransactionsTableProps {
  transactions: Transaction[]
  isLoading: boolean
}

export function TransactionsTable({ transactions, isLoading }: TransactionsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "已完成":
        return (
          <Badge variant="default" className="bg-green-500">
            已完成
          </Badge>
        )
      case "處理中":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            處理中
          </Badge>
        )
      case "已取消":
        return <Badge variant="destructive">已取消</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Format currency values
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  
  // Generate item summary for display in the table
  const getItemSummary = (transaction: Transaction) => {
    if (!transaction.items || transaction.items.length === 0) {
      return "無商品資訊";
    }
    
    if (transaction.items.length === 1) {
      const item = transaction.items[0];
      return (
        <div className="flex items-center">
          <span className="font-medium">{item.productName}</span>
          <Badge variant="outline" className="ml-2 text-xs">
            x{item.quantity}
          </Badge>
        </div>
      );
    }
    
    // For multiple items, show the first one and a count
    return (
      <div>
        <div className="flex items-center">
          <span className="font-medium">{transaction.items[0].productName}</span>
          <Badge variant="outline" className="ml-2 text-xs">
            x{transaction.items[0].quantity}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          +{transaction.items.length - 1} 其他商品
        </div>
      </div>
    );
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[100px]">訂單 ID</TableHead>
              <TableHead>客戶</TableHead>
              <TableHead>商品</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  金額
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>日期</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(10).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // No transactions found
  if (transactions.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[100px]">訂單 ID</TableHead>
              <TableHead>客戶</TableHead>
              <TableHead>商品</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  金額
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>日期</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2 py-4 text-muted-foreground">
                  <FileText className="h-10 w-10 opacity-20" />
                  <p>沒有找到交易記錄</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  // Render transactions with expanded details
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[100px]">訂單 ID</TableHead>
            <TableHead>客戶</TableHead>
            <TableHead>商品</TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                金額
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>日期</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <Fragment key={transaction.id}>
              <TableRow className={expandedRows[transaction.id] ? "bg-muted/30" : ""}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => toggleRowExpand(transaction.id)}
                  >
                    {expandedRows[transaction.id] ? (
                      <ChevronDown className="h-4 w-4" /> 
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">#{transaction.id.substring(0, 8)}</TableCell>
                <TableCell>{transaction.customer}</TableCell>
                <TableCell>
                  <div className="group relative cursor-pointer">
                    <div className="max-w-xs">
                      {getItemSummary(transaction)}
                    </div>
                    <div className="absolute z-50 hidden group-hover:block bg-white p-2 rounded shadow-lg border mt-1 min-w-[200px]">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">商品列表:</p>
                        <ul className="text-xs space-y-1">
                          {transaction.items?.map((item) => (
                            <li key={item.id} className="flex justify-between gap-4">
                              <span>{item.productName}</span>
                              <span>x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
              
              {expandedRows[transaction.id] && (
                <TableRow className="bg-muted/30 border-t-0">
                  <TableCell colSpan={7} className="p-4">
                    <div className="rounded-md bg-background p-3 shadow-sm">
                      <h4 className="text-sm font-medium mb-2">訂單詳情</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">訂單 ID</p>
                          <p className="font-medium">{transaction.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">客戶</p>
                          <p className="font-medium">{transaction.customer}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">訂單日期</p>
                          <p className="font-medium">{transaction.date}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 overflow-x-auto">
                        <p className="text-sm font-medium mb-2">商品清單</p>
                        <table className="w-full text-sm border-collapse min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium text-muted-foreground">商品名稱</th>
                              <th className="text-center py-2 font-medium text-muted-foreground">數量</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">單價</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">小計</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transaction.items?.map((item) => (
                              <tr key={item.id} className="border-b border-muted">
                                <td className="py-2">{item.productName}</td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right">{formatCurrency(parseFloat(item.price))}</td>
                                <td className="py-2 text-right">
                                  {formatCurrency(item.quantity * parseFloat(item.price))}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={3} className="py-2 text-right font-medium">總計</td>
                              <td className="py-2 text-right font-bold text-primary">
                                {formatCurrency(transaction.amount)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
