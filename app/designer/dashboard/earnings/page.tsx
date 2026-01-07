"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Info, DollarSign, TrendingUp, ShoppingCart, Calendar } from "lucide-react"

interface EarningsData {
  id: string
  themeName: string
  saleDate: string
  salePrice: number
  designerEarning: number
  companyEarning: number
  customerEmail: string
}

export default function EarningsPage() {
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all')
  const [earnings, setEarnings] = useState<EarningsData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const response = await fetch('/api/designer/earnings')
        if (response.ok) {
          const data = await response.json()
          setEarnings(data)
        }
      } catch (error) {
        console.error('Error fetching earnings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEarnings()
  }, [])

  const totalEarnings = earnings.reduce((sum, sale) => sum + sale.designerEarning, 0)
  const monthlyEarnings = earnings
    .filter(sale => {
      const saleDate = new Date(sale.saleDate)
      const now = new Date()
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, sale) => sum + sale.designerEarning, 0)
  
  const totalSales = earnings.length
  const averageEarning = totalEarnings / totalSales || 0

  const filteredEarnings = timeRange === 'all' 
    ? earnings 
    : timeRange === 'month'
    ? earnings.filter(sale => {
        const saleDate = new Date(sale.saleDate)
        const now = new Date()
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
      })
    : earnings.filter(sale => {
        const saleDate = new Date(sale.saleDate)
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return saleDate >= weekAgo
      })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Earnings</h2>
          <p className="text-muted-foreground">Track your sales and earnings from theme purchases</p>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <>
                <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <>
                <div className="text-2xl font-bold">${monthlyEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Current month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mb-2" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalSales}</div>
                <p className="text-xs text-muted-foreground">Theme purchases</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Sale</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <>
                <div className="text-2xl font-bold">${averageEarning.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">15% commission</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Commission Info */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Commission Structure</CardTitle>
            <CardDescription>
              Understanding your earnings breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  You receive <strong>15%</strong> of each theme sale
                </p>
                <p className="text-sm text-muted-foreground">
                  The company receives <strong>85%</strong>. Earnings are calculated automatically when a customer purchases your theme.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Range Filter */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Time Range</CardTitle>
            <CardDescription>
              Filter earnings by period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setTimeRange('all')}
                variant={timeRange === 'all' ? 'default' : 'outline'}
                className="w-full justify-start"
              >
                All Time
              </Button>
              <Button
                onClick={() => setTimeRange('month')}
                variant={timeRange === 'month' ? 'default' : 'outline'}
                className="w-full justify-start"
              >
                This Month
              </Button>
              <Button
                onClick={() => setTimeRange('week')}
                variant={timeRange === 'week' ? 'default' : 'outline'}
                className="w-full justify-start"
              >
                This Week
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
          <CardDescription>
            Detailed breakdown of your earnings by sale
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Theme</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sale Price</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Your Earnings</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEarnings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Info className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No earnings found for this period</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEarnings.map((sale) => (
                        <tr key={sale.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">
                            {new Date(sale.saleDate).toLocaleDateString()}
                          </td>
                          <td className="p-4 align-middle font-medium">
                            {sale.themeName}
                          </td>
                          <td className="p-4 align-middle">
                            ${sale.salePrice.toFixed(2)}
                          </td>
                          <td className="p-4 align-middle font-semibold">
                            ${sale.designerEarning.toFixed(2)}
                          </td>
                          <td className="p-4 align-middle text-muted-foreground">
                            ${sale.companyEarning.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {filteredEarnings.length > 0 && (
                    <tfoot>
                      <tr className="border-t bg-muted/50 font-medium">
                        <td colSpan={3} className="p-4 align-middle text-right">
                          Total:
                        </td>
                        <td className="p-4 align-middle font-bold">
                          ${filteredEarnings.reduce((sum, sale) => sum + sale.designerEarning, 0).toFixed(2)}
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          ${filteredEarnings.reduce((sum, sale) => sum + sale.companyEarning, 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}




