"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionsTable } from "@/components/report/transactions-table"
import { TimeRangeFilter } from "@/components/report/time-range-filter"
import { useAuthStore } from "@/stores/useAuthStore"
import { useFinancialReports } from "@/hooks/use-financial-reports"
import { checkAuthAndRedirect } from "@/utils/auth"

export default function FinancialReportPage() {
  const router = useRouter()
  const { isLoggedIn, user, token } = useAuthStore()
  const [timeRange, setTimeRange] = useState<string>("本月")
  const [currentView, setCurrentView] = useState<string>("summary")
  const { financialData, transactions, isLoading } = useFinancialReports(timeRange, token)
  const reportRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
      return
    }

    // 檢查用戶權限
    if (checkAuthAndRedirect(user, router)) {
      return
    }
  }, [isLoggedIn, router, user])

  // Handle CSV export
  const handleExportCSV = () => {
    setIsExporting(true)
    
    try {
      // Prepare CSV content based on current view
      let csvContent = ""
      let fileName = ""
      
      if (currentView === "summary") {
        // Headers for summary
        csvContent = "項目,數值\n"

        // Add summary data
        csvContent += `總銷售額,${financialData?.totalSales}\n`
        csvContent += `總退款,${financialData?.totalRefunds}\n`
        csvContent += `淨收入,${financialData?.netRevenue}\n`
        csvContent += `交易數量,${financialData?.transactionCount}\n`
        csvContent += `平均訂單金額,${financialData?.averageOrderValue}\n`
        csvContent += `退款率,${financialData?.refundRate}%\n`
        csvContent += `毛利率,${financialData?.grossMargin}%\n`
        csvContent += `營運成本,${financialData?.operatingCosts}\n`
        
        fileName = `財務摘要_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`
      } else {
        // Headers for detailed transactions
        csvContent = "交易ID,客戶,日期,金額,狀態\n"
        
        // Add transaction data
        transactions.forEach(transaction => {
          // Properly escape fields that might contain commas
          const customer = `"${transaction.customer.replace(/"/g, '""')}"`
          
          csvContent += `${transaction.id},${customer},${transaction.date},${transaction.amount},${transaction.status}\n`
        })
        
        fileName = `交易明細_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`
      }
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('CSV export error:', error)
      alert('匯出CSV時發生錯誤')
    } finally {
      setIsExporting(false)
    }
  }

  if (!isLoggedIn || !user) {
    return null
  }

  // 再次檢查權限（防止直接載入）
  if (checkAuthAndRedirect(user, router)) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col" ref={reportRef}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to dashboard</span>
        </Button>
        <h1 className="text-lg sm:text-xl font-semibold truncate">財務報表</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1"
            onClick={handleExportCSV}
            disabled={isLoading || transactions.length === 0 || isExporting}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{isExporting ? '匯出中...' : '匯出CSV'}</span>
            <span className="inline sm:hidden">{isExporting ? '匯出中...' : '匯出'}</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
          {/* Time Range Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TimeRangeFilter currentTimeRange={timeRange} onTimeRangeChange={setTimeRange} />
            <Tabs value={currentView} onValueChange={setCurrentView} className="w-full sm:w-auto">
              <TabsList className="grid w-full sm:w-[300px] grid-cols-2">
                <TabsTrigger value="summary" className="text-xs sm:text-sm">財報數據統計</TabsTrigger>
                <TabsTrigger value="detailed" className="text-xs sm:text-sm">詳細交易財報</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-3/4" />
                      <Skeleton className="mt-2 h-4 w-1/4" />
                    </CardContent>
                  </Card>
                ))
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>總銷售額</CardDescription>
                    <CardTitle className="text-3xl">${financialData?.totalSales.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{timeRange}期間的總銷售額</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>總退款</CardDescription>
                    <CardTitle className="text-3xl">${financialData?.totalRefunds.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{timeRange}期間的總退款額</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>淨收入</CardDescription>
                    <CardTitle className="text-3xl">${financialData?.netRevenue.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{timeRange}期間的淨收入</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>交易數量</CardDescription>
                    <CardTitle className="text-3xl">{financialData?.transactionCount.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{timeRange}期間的交易總數</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Tab Content */}
          <Tabs value={currentView} className="w-full">
            <TabsContent value="summary" className="mt-6 space-y-6">
              {isLoading ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>財務摘要</CardTitle>
                    <CardDescription>{timeRange}期間的財務表現概覽</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">平均訂單金額</p>
                          <p className="text-xl font-semibold">${financialData?.averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">退款率</p>
                          <p className="text-xl font-semibold">{financialData?.refundRate.toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">毛利率</p>
                          <p className="text-xl font-semibold">{financialData?.grossMargin.toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">營運成本</p>
                          <p className="text-xl font-semibold">${financialData?.operatingCosts.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="detailed" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>交易明細</CardTitle>
                  <CardDescription>{timeRange}期間的所有交易記錄</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionsTable transactions={transactions} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
