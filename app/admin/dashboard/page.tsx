'use client'

import Link from 'next/link'

/**
 * Admin Dashboard Page
 * Displays overview statistics and quick actions for administrators
 * TODO: Replace mock data with actual data fetching
 */
export default function AdminDashboardPage() {
  // Mock data - replace with actual data fetching
  const stats = {
    totalUsers: 1250,
    totalOrders: 342,
    totalThemes: 45,
    totalDesigners: 12,
    totalRevenue: 34200.00,
    monthlyRevenue: 8500.00,
    pendingOrders: 8
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#36463A] mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your platform's performance</p>
      </div>

      {/* Stats Grid */}
      <section aria-label="Dashboard statistics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">Total Users</p>
              <p className="text-3xl font-bold text-[#36463A] mt-2">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">Total Orders</p>
              <p className="text-3xl font-bold text-[#36463A] mt-2">{stats.totalOrders}</p>
              <p className="text-xs text-gray-600 mt-1">{stats.pendingOrders} pending</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">Total Revenue</p>
              <p className="text-3xl font-bold text-[#36463A] mt-2">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">${stats.monthlyRevenue.toLocaleString()} this month</p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Themes */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">Total Themes</p>
              <p className="text-3xl font-bold text-[#36463A] mt-2">{stats.totalThemes}</p>
              <p className="text-xs text-gray-600 mt-1">{stats.totalDesigners} designers</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
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
            href="/admin/dashboard/users"
            className="p-6 bg-white border-2 border-[#327442] rounded-lg hover:bg-[#327442] hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#327442] group-hover:bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white group-hover:text-[#327442]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-white">Manage Users</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-200">View and manage user accounts</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/orders"
            className="p-6 bg-white border-2 border-gray-300 rounded-lg hover:border-[#327442] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 group-hover:bg-[#327442] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">View Orders</h3>
                <p className="text-sm text-gray-600">Monitor and process orders</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/themes"
            className="p-6 bg-white border-2 border-gray-300 rounded-lg hover:border-[#327442] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 group-hover:bg-[#327442] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Manage Themes</h3>
                <p className="text-sm text-gray-600">Review and approve themes</p>
              </div>
            </div>
          </Link>
        </nav>
      </section>

      {/* Recent Activity */}
      <section className="mt-8" aria-label="Recent platform activity">
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
                <p className="font-medium">New order #342 completed</p>
                <p className="text-sm text-gray-600">Customer: john@example.com • $100.00 • 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-gray-600">user@example.com • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">Theme "Romantic Rose" approved</p>
                <p className="text-sm text-gray-600">Designer: designer@example.com • 3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}



