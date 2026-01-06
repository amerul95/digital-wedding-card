'use client'
import React from 'react'

// Mock data - replace with actual data fetching
const mockDesigners = [
  {
    id: '1',
    email: 'designer1@example.com',
    name: 'John Designer',
    themes: 5,
    totalSales: 25,
    totalEarnings: 375.00,
    joinedDate: '2024-01-15'
  },
  {
    id: '2',
    email: 'designer2@example.com',
    name: 'Jane Artist',
    themes: 3,
    totalSales: 15,
    totalEarnings: 225.00,
    joinedDate: '2024-01-20'
  },
  {
    id: '3',
    email: 'designer3@example.com',
    name: 'Mike Creator',
    themes: 4,
    totalSales: 8,
    totalEarnings: 120.00,
    joinedDate: '2024-02-01'
  },
]

export default function DesignersPage() {
  const totalDesigners = mockDesigners.length
  const totalThemes = mockDesigners.reduce((sum, d) => sum + d.themes, 0)
  const totalSales = mockDesigners.reduce((sum, d) => sum + d.totalSales, 0)
  const totalEarnings = mockDesigners.reduce((sum, d) => sum + d.totalEarnings, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#36463A] mb-2">Designers Management</h1>
        <p className="text-gray-600">Manage designers and their performance</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Total Designers</p>
          <p className="text-2xl font-bold text-[#36463A]">{totalDesigners}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Total Themes</p>
          <p className="text-2xl font-bold text-[#36463A]">{totalThemes}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-[#36463A]">{totalSales}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600">Designer Earnings</p>
          <p className="text-2xl font-bold text-[#36463A]">${totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Designers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Designer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Themes</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Sales</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDesigners.map((designer) => (
                <tr key={designer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#36463A]">
                    {designer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {designer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {designer.themes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {designer.totalSales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${designer.totalEarnings.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(designer.joinedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-[#327442] hover:text-[#2d3a2f]">View</button>
                      <button className="text-gray-600 hover:text-gray-800">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



