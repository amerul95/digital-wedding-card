'use client'
import React from 'react'
import Image from 'next/image'
import OrderCard from './OrderCard'

// Mock data - Replace with actual data from your API/database
const mockOrders = [
  {
    id: '1',
    title: 'Walimatul Urus Adam & Hawa',
    createdAt: '05/12/2025',
    expiryDate: '6 months after payment',
    invitationLink: 'Onespecialday.com/0202/Adam-Hawa',
    designName: 'Design I',
    designerName: 'By Payuk Lee',
    status: 'pending' as const
  },
  // Add more orders here when you have data
]

export default function OrdersSection() {
  const orders = mockOrders // Replace with actual data fetching

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <h1 
          className='text-2xl font-bold text-gray-900 uppercase'
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          ORDERS
        </h1>
        {orders.length > 0 && (
          <button
            className='flex items-center gap-3 px-6 py-3 rounded-lg border border-[#327442] bg-white text-[#327442] hover:bg-[#327442] hover:text-white transition-colors'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-6 h-6 flex items-center justify-center'>
              <Image src="/profile/add.png" alt="Add" width={24} height={24} />
            </div>
            <span className='font-medium'>Create New Order</span>
          </button>
        )}
      </div>
      
      {orders.length === 0 ? (
        /* Empty State */
        <div className='flex flex-col items-center justify-center min-h-[400px]'>
          <p 
            className='text-gray-900 mb-6 text-base'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            No order yet.
          </p>
          <button
            className='flex items-center gap-3 px-6 py-3 rounded-lg border border-[#327442] bg-white text-[#327442] hover:bg-[#327442] hover:text-white transition-colors'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-6 h-6 flex items-center justify-center'>
              <Image src="/profile/add.png" alt="Add" width={24} height={24} />
            </div>
            <span className='font-medium'>Create New Order</span>
          </button>
        </div>
      ) : (
        /* Orders List */
        <div>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              title={order.title}
              createdAt={order.createdAt}
              expiryDate={order.expiryDate}
              invitationLink={order.invitationLink}
              designName={order.designName}
              designerName={order.designerName}
              status={order.status}
            />
          ))}
        </div>
      )}
    </div>
  )
}

