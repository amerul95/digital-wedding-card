'use client'
import React, { useState } from 'react'

// Mock data - replace with actual data fetching
const mockEarnings = [
  {
    id: '1',
    themeName: 'Romantic Rose',
    saleDate: '2024-02-15',
    salePrice: 100.00,
    designerEarning: 15.00, // 15%
    companyEarning: 85.00,  // 85%
    customerEmail: 'customer1@example.com'
  },
  {
    id: '2',
    themeName: 'Elegant Gold',
    saleDate: '2024-02-14',
    salePrice: 100.00,
    designerEarning: 15.00,
    companyEarning: 85.00,
    customerEmail: 'customer2@example.com'
  },
  {
    id: '3',
    themeName: 'Romantic Rose',
    saleDate: '2024-02-13',
    salePrice: 100.00,
    designerEarning: 15.00,
    companyEarning: 85.00,
    customerEmail: 'customer3@example.com'
  },
  {
    id: '4',
    themeName: 'Modern Minimalist',
    saleDate: '2024-02-12',
    salePrice: 100.00,
    designerEarning: 15.00,
    companyEarning: 85.00,
    customerEmail: 'customer4@example.com'
  },
  {
    id: '5',
    themeName: 'Elegant Gold',
    saleDate: '2024-02-10',
    salePrice: 100.00,
    designerEarning: 15.00,
    companyEarning: 85.00,
    customerEmail: 'customer5@example.com'
  },
]

export default function EarningsPage() {
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all')

  const totalEarnings = mockEarnings.reduce((sum, sale) => sum + sale.designerEarning, 0)
  const monthlyEarnings = mockEarnings
    .filter(sale => {
      const saleDate = new Date(sale.saleDate)
      const now = new Date()
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, sale) => sum + sale.designerEarning, 0)
  
  const totalSales = mockEarnings.length
  const averageEarning = totalEarnings / totalSales || 0

  const filteredEarnings = timeRange === 'all' 
    ? mockEarnings 
    : timeRange === 'month'
    ? mockEarnings.filter(sale => {
        const saleDate = new Date(sale.saleDate)
        const now = new Date()
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
      })
    : mockEarnings.filter(sale => {
        const saleDate = new Date(sale.saleDate)
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return saleDate >= weekAgo
      })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#36463A] mb-2">Earnings</h1>
        <p className="text-gray-600">Track your sales and earnings from theme purchases</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Total Earnings</p>
          <p className="text-3xl font-bold text-[#36463A]">${totalEarnings.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">All time</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">This Month</p>
          <p className="text-3xl font-bold text-[#36463A]">${monthlyEarnings.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">Current month</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Total Sales</p>
          <p className="text-3xl font-bold text-[#36463A]">{totalSales}</p>
          <p className="text-xs text-gray-600 mt-1">Theme purchases</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Avg per Sale</p>
          <p className="text-3xl font-bold text-[#36463A]">${averageEarning.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">15% commission</p>
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-blue-900 mb-1">Commission Structure</p>
            <p className="text-sm text-blue-800">
              You receive <strong>15%</strong> of each theme sale, while the company receives <strong>85%</strong>. 
              Earnings are calculated automatically when a customer purchases your theme.
            </p>
          </div>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeRange('all')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            timeRange === 'all'
              ? 'bg-[#327442] text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            timeRange === 'month'
              ? 'bg-[#327442] text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            timeRange === 'week'
              ? 'bg-[#327442] text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          This Week
        </button>
      </div>

      {/* Earnings Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Theme</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sale Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Your Earnings (15%)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company (85%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEarnings.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#36463A]">
                    {sale.themeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${sale.salePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${sale.designerEarning.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${sale.companyEarning.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            {filteredEarnings.length > 0 && (
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                    Total:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    ${filteredEarnings.reduce((sum, sale) => sum + sale.designerEarning, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${filteredEarnings.reduce((sum, sale) => sum + sale.companyEarning, 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {filteredEarnings.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600">No earnings found for this period</p>
          </div>
        )}
      </div>
    </div>
  )
}



