'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DesignerLayoutProps {
  children: React.ReactNode
}

export default function DesignerLayout({ children }: DesignerLayoutProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path)

  return (
    <div className='max-w-7xl mx-auto min-h-screen flex px-10'>
      {/* Left Sidebar Navigation */}
      <div className='w-64 bg-white flex flex-col py-8'>
        {/* Logo/Header */}
        <div className='px-6 mb-8'>
          <h2 className='text-xl font-bold text-[#36463A]'>Designer Dashboard</h2>
        </div>

        {/* Navigation Items */}
        <div className='flex-1'>
          {/* DASHBOARD */}
          <Link
            href='/designer/dashboard'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/designer/dashboard') && pathname === '/designer/dashboard'
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

          {/* CREATE THEME */}
          <Link
            href='/designer/dashboard/create-theme'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/designer/dashboard/create-theme')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className='font-semibold uppercase text-sm'>CREATE THEME</span>
          </Link>

          {/* MY THEMES */}
          <Link
            href='/designer/dashboard/themes'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/designer/dashboard/themes')
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
            <span className='font-semibold uppercase text-sm'>MY THEMES</span>
          </Link>

          {/* EARNINGS */}
          <Link
            href='/designer/dashboard/earnings'
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              isActive('/designer/dashboard/earnings')
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 flex items-center justify-center'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className='font-semibold uppercase text-sm'>EARNINGS</span>
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



