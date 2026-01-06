'use client'
import React, { useState } from 'react'
import Link from 'next/link'

// Mock data - replace with actual data fetching
const mockThemes = [
  {
    id: '1',
    name: 'Romantic Rose',
    status: 'published',
    createdAt: '2024-01-15',
    sales: 12,
    earnings: 180.00,
    previewImage: '/catalogs/catalog1.png'
  },
  {
    id: '2',
    name: 'Elegant Gold',
    status: 'published',
    createdAt: '2024-01-20',
    sales: 8,
    earnings: 120.00,
    previewImage: '/catalogs/catalog2.png'
  },
  {
    id: '3',
    name: 'Classic White',
    status: 'draft',
    createdAt: '2024-02-01',
    sales: 0,
    earnings: 0.00,
    previewImage: '/catalogs/catalog3.png'
  },
  {
    id: '4',
    name: 'Modern Minimalist',
    status: 'published',
    createdAt: '2024-02-05',
    sales: 5,
    earnings: 75.00,
    previewImage: '/catalogs/catalog4.png'
  },
]

export default function ThemesPage() {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  const filteredThemes = filter === 'all' 
    ? mockThemes 
    : mockThemes.filter(theme => theme.status === filter)

  const totalThemes = mockThemes.length
  const publishedThemes = mockThemes.filter(t => t.status === 'published').length
  const draftThemes = mockThemes.filter(t => t.status === 'draft').length
  const totalSales = mockThemes.reduce((sum, theme) => sum + theme.sales, 0)
  const totalEarnings = mockThemes.reduce((sum, theme) => sum + theme.earnings, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#36463A] mb-2">My Themes</h1>
          <p className="text-gray-600">Manage and track your created themes</p>
        </div>
        <Link
          href="/designer/dashboard/create-theme"
          className="px-6 py-2 rounded-full bg-[#327442] text-white text-sm shadow hover:bg-[#2d3a2f] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Theme
        </Link>
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
          <p className="text-sm text-gray-600">Drafts</p>
          <p className="text-2xl font-bold text-[#36463A]">{draftThemes}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-[#36463A]">{totalSales}</p>
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
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'draft'
              ? 'text-[#327442] border-b-2 border-[#327442]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Drafts ({draftThemes})
        </button>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => (
          <div
            key={theme.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Preview Image */}
            <div className="aspect-video bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Theme Preview</span>
              </div>
              {theme.status === 'published' && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Published
                </div>
              )}
              {theme.status === 'draft' && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Draft
                </div>
              )}
            </div>

            {/* Theme Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-[#36463A] mb-2">{theme.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(theme.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales:</span>
                  <span className="font-semibold">{theme.sales}</span>
                </div>
                <div className="flex justify-between">
                  <span>Earnings:</span>
                  <span className="font-semibold text-green-600">${theme.earnings.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-[#327442] text-white rounded-lg hover:bg-[#2d3a2f] transition-colors text-sm">
                  Edit
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <p className="text-gray-600 mb-4">No themes found</p>
          <Link
            href="/designer/dashboard/create-theme"
            className="inline-block px-6 py-2 bg-[#327442] text-white rounded-lg hover:bg-[#2d3a2f] transition-colors"
          >
            Create Your First Theme
          </Link>
        </div>
      )}
    </div>
  )
}



