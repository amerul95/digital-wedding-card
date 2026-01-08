'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ProfileLayoutProps {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className='max-w-7xl mx-auto min-h-screen flex px-10'>
      {/* Left Sidebar Navigation */}
      <div className='w-64 bg-white flex flex-col py-8'>
        {/* Navigation Items */}
        <div className='flex-1'>
          {/* MY PROFILE */}
          <Link
            href='/profile'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/profile')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5'>
              <Image src="/profile/profile.png" alt="Profile" width={20} height={20} />
            </div>
            <span className='font-semibold uppercase text-sm'>MY PROFILE</span>
          </Link>

          {/* ORDERS */}
          <Link
            href='/orders'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/orders')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5'>
              <Image src="/profile/orders.png" alt="Orders" width={20} height={20} />
            </div>
            <span className='font-semibold uppercase text-sm'>ORDERS</span>
          </Link>

          {/* FAVOURITES */}
          <Link
            href='/favourites'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/favourites')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5'>
              <Image src="/profile/favourites.png" alt="Favourites" width={20} height={20} />
            </div>
            <span className='font-semibold uppercase text-sm'>FAVOURITES</span>
          </Link>
        </div>

        {/* LOG OUT */}
        <div className='px-6 py-4'>
          <button
            className='w-full flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5'>
              <Image src="/profile/logout.png" alt="Logout" width={20} height={20} />
            </div>
            <span className='font-semibold uppercase text-sm'>LOG OUT</span>
          </button>
        </div>
      </div>

      {/* Right Main Content Area */}
      <div className='flex-1 bg-white py-8 px-8 border border-[#CFCFCF] my-[29px] mx-[22px] rounded-[15px]'>
        {children}
      </div>
    </div>
  )
}










