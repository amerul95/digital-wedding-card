'use client'
import React, { useState } from 'react'

// Mock data - replace with actual data fetching
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerEmail: 'customer1@example.com',
    total: 100.00,
    status: 'completed',
    createdAt: '2024-02-15',
    items: ['Romantic Rose Theme']
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerEmail: 'customer2@example.com',
    total: 100.00,
    status: 'pending',
    createdAt: '2024-02-14',
    items: ['Elegant Gold Theme']
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerEmail: 'customer3@example.com',
    total: 200.00,
    status: 'completed',
    createdAt: '2024-02-13',
    items: ['Romantic Rose Theme', 'Classic Song']
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customerEmail: 'customer4@example.com',
    total: 100.00,
    status: 'cancelled',
    createdAt: '2024-02-12',
    items: ['Modern Minimalist Theme']
  },
]

export default function OrdersPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')

  const filteredOrders = filter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filter)

  const totalOrders = mockOrders.length
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length
  const completedOrders = mockOrders.filter(o => o.status === 'completed').length
  const cancelledOrders = mockOrders.filter(o => o.status === 'cancelled').length
  const totalRevenue = mockOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#36463A] mb-2">Orders Management</h1>
          <p className="text-gray-600">Monitor and process customer orders</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-[#36463A]">{totalOrders}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-[#36463A]">{pendingOrders}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-[#36463A]">{completedOrders}</p>
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
          All ({totalOrders})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'pending'
              ? 'text-[#327442] border-b-2 border-[#327442]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingOrders})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'completed'
              ? 'text-[#327442] border-b-2 border-[#327442]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed ({completedOrders})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'cancelled'
              ? 'text-[#327442] border-b-2 border-[#327442]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Cancelled ({cancelledOrders})
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#36463A]">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerEmail}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      {order.items.map((item, idx) => (
                        <span key={idx}>{item}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#36463A]">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-[#327442] hover:text-[#2d3a2f]">View</button>
                      {order.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-800">Process</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}



