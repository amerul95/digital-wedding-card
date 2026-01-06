'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path)

  return (
    <div className='max-w-7xl mx-auto min-h-screen flex px-10'>
      {/* Left Sidebar Navigation */}
      <div className='w-64 bg-white flex flex-col py-8'>
        {/* Logo/Header */}
        <div className='px-6 mb-8'>
          <h2 className='text-xl font-bold text-[#36463A]'>Admin Dashboard</h2>
        </div>

        {/* Navigation Items */}
        <div className='flex-1'>
          {/* DASHBOARD */}
          <Link
            href='/admin/dashboard'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/admin/dashboard') && pathname === '/admin/dashboard'
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className='font-semibold uppercase text-sm'>DASHBOARD</span>
          </Link>

          {/* USERS */}
          <Link
            href='/admin/dashboard/users'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/admin/dashboard/users')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className='font-semibold uppercase text-sm'>USERS</span>
          </Link>

          {/* THEMES */}
          <Link
            href='/admin/dashboard/themes'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/admin/dashboard/themes')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <span className='font-semibold uppercase text-sm'>THEMES</span>
          </Link>

          {/* ORDERS */}
          <Link
            href='/admin/dashboard/orders'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/admin/dashboard/orders')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className='font-semibold uppercase text-sm'>ORDERS</span>
          </Link>

          {/* DESIGNERS */}
          <Link
            href='/admin/dashboard/designers'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/admin/dashboard/designers')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className='font-semibold uppercase text-sm'>DESIGNERS</span>
          </Link>

          {/* SETTINGS */}
          <Link
            href='/admin/dashboard/settings'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/admin/dashboard/settings')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className='font-semibold uppercase text-sm'>SETTINGS</span>
          </Link>
        </div>

        {/* LOG OUT */}
        <div className='px-6 py-4'>
          <button
            className='w-full flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
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



