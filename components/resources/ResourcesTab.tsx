'use client'
import React, { useState } from 'react'

type TabType = 'tutorial' | 'faq'

interface ResourcesTabProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function ResourcesTab({ activeTab, onTabChange }: ResourcesTabProps) {
  return (
    <div className='flex flex-col items-center'>
      {/* Title */}
      <h1 
        className='text-2xl font-bold text-[#36463A] mb-8 text-center'
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        Resources
      </h1>

      {/* Tab Bar */}
      <div className='flex border border-gray-300 rounded-full overflow-hidden'>
        {/* Tutorial Tab */}
        <button
          onClick={() => onTabChange('tutorial')}
          className={`px-8 py-3 font-semibold text-sm transition-colors ${
            activeTab === 'tutorial'
              ? 'bg-[#36463A] text-white'
              : 'bg-white text-[#36463A]'
          }`}
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          Tutorial
        </button>

        {/* FAQ Tab */}
        <button
          onClick={() => onTabChange('faq')}
          className={`px-8 py-3 font-semibold text-sm transition-colors ${
            activeTab === 'faq'
              ? 'bg-[#36463A] text-white'
              : 'bg-white text-[#36463A]'
          }`}
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          FAQ
        </button>
      </div>
    </div>
  )
}

