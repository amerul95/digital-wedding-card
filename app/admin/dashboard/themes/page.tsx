'use client'
import React, { useState } from 'react'

// Mock data - replace with actual data fetching
const mockThemes = [
  {
    id: '1',
    name: 'Romantic Rose',
    designer: 'designer1@example.com',
    status: 'published',
    createdAt: '2024-01-15',
    sales: 12,
    revenue: 1200.00
  },
  {
    id: '2',
    name: 'Elegant Gold',
    designer: 'designer2@example.com',
    status: 'published',
    createdAt: '2024-01-20',
    sales: 8,
    revenue: 800.00
  },
  {
    id: '3',
    name: 'Classic White',
    designer: 'designer1@example.com',
    status: 'pending',
    createdAt: '2024-02-01',
    sales: 0,
    revenue: 0.00
  },
  {
    id: '4',
    name: 'Modern Minimalist',
    designer: 'designer3@example.com',
    status: 'published',
    createdAt: '2024-02-05',
    sales: 5,
    revenue: 500.00
  },
]

export default function ThemesPage() {
  const [filter, setFilter] = useState<'all' | 'published' | 'pending'>('all')

  const filteredThemes = filter === 'all' 
    ? mockThemes 
    : mockThemes.filter(theme => theme.status === filter)

  const totalThemes = mockThemes.length
  const publishedThemes = mockThemes.filter(t => t.status === 'published').length
  const pendingThemes = mockThemes.filter(t => t.status === 'pending').length
  const totalRevenue = mockThemes.reduce((sum, theme) => sum + theme.revenue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#36463A] mb-2">Themes Management</h1>
          <p className="text-gray-600">Review and manage all themes</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Total Themes</p>
          <p className="text-2xl font-bold text-[#36463A]">{totalThemes}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Published</p>
          <p className="text-2xl font-bold text-[#36463A]">{publishedThemes}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-[#36463A]">{pendingThemes}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-[#36463A]">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'all'
              ? 'text-[#327442] border-b-2 border-[#327442]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({totalThemes})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'published'
              ? 'text-[#327442] border-b-2 border-[#327442]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Published ({publishedThemes})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'pending'
              ? 'text-[#327442] border-b-2 border-[#327442]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingThemes})
        </button>
      </div>

      {/* Themes Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Theme Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Designer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredThemes.map((theme) => (
                <tr key={theme.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#36463A]">
                    {theme.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {theme.designer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      theme.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {theme.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(theme.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {theme.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${theme.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {theme.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-800">Approve</button>
                          <button className="text-red-600 hover:text-red-800">Reject</button>
                        </>
                      )}
                      <button className="text-[#327442] hover:text-[#2d3a2f]">View</button>
                      <button className="text-gray-600 hover:text-gray-800">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredThemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No themes found</p>
          </div>
        )}
      </div>
    </div>
  )
}



