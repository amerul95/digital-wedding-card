'use client'

import Link from 'next/link'

/**
 * Designer Dashboard Page
 * Displays overview statistics and quick actions for designers
 * TODO: Replace mock data with actual data fetching
 */
export default function DesignerDashboardPage() {
  // Mock data - replace with actual data fetching
  const stats = {
    totalThemes: 12,
    publishedThemes: 8,
    totalEarnings: 1250.50,
    monthlyEarnings: 320.75,
    totalSales: 45
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#36463A] mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's your design studio at a glance.</p>
      </div>

      {/* Stats Grid */}
      <section aria-label="Dashboard statistics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Themes */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">Total Themes</p>
              <p className="text-3xl font-bold text-[#36463A] mt-2">{stats.totalThemes}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
          </div>
        </div>

        {/* Published Themes */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">Published</p>
              <p className="text-3xl font-bold text-[#36463A] mt-2">{stats.publishedThemes}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">Total Earnings</p>
              <p className="text-3xl font-bold text-[#36463A] mt-2">${stats.totalEarnings.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">Total Sales</p>
              <p className="text-3xl font-bold text-[#36463A] mt-2">{stats.totalSales}</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-8" aria-label="Quick action links">
        <h2 className="text-xl font-semibold text-[#36463A] mb-4">Quick Actions</h2>
        <nav className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Navigation menu">
          <Link
            href="/designer/dashboard/create-theme"
            className="p-6 bg-white border-2 border-[#327442] rounded-lg hover:bg-[#327442] hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#327442] group-hover:bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white group-hover:text-[#327442]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-white">Create New Theme</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-200">Start designing a new wedding theme</p>
              </div>
            </div>
          </Link>

          <Link
            href="/designer/dashboard/themes"
            className="p-6 bg-white border-2 border-gray-300 rounded-lg hover:border-[#327442] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 group-hover:bg-[#327442] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">View My Themes</h3>
                <p className="text-sm text-gray-600">Manage your created themes</p>
              </div>
            </div>
          </Link>

          <Link
            href="/designer/dashboard/earnings"
            className="p-6 bg-white border-2 border-gray-300 rounded-lg hover:border-[#327442] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 group-hover:bg-[#327442] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">View Earnings</h3>
                <p className="text-sm text-gray-600">Track your sales and revenue</p>
              </div>
            </div>
          </Link>
        </nav>
      </section>

      {/* Recent Activity */}
      <section className="mt-8" aria-label="Recent activity">
        <h2 className="text-xl font-semibold text-[#36463A] mb-4">Recent Activity</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">Theme "Romantic Rose" was purchased</p>
                <p className="text-sm text-gray-600">You earned $15.00 • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">New theme "Elegant Gold" created</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">Theme "Classic White" was published</p>
                <p className="text-sm text-gray-600">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}



