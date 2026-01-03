'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Great_Vibes } from 'next/font/google'

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
})

export default function DesignsSection() {
  const [activeFilter, setActiveFilter] = useState<'trending' | 'bestseller'>('trending')
  const designs = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className='max-w-7xl mx-auto py-12 px-6'>
      <div>
        <h4 
          className={`text-center text-[48px] ${greatVibes.variable} font-great-vibes`}
          style={{ 
            fontSize: '48px',
            fontFamily: 'Great Vibes, cursive',
            fontWeight: 'normal',
            color: '#1A2715'
          }}
        >
          Our Designs
        </h4>
        
        {/* Carousel Container */}
        <div className='relative mt-12'>
          {/* Left Arrow */}
          <button 
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'
            aria-label="Previous designs"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 9L4.5 6L7.5 3" stroke="#1A2715" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Designs Grid */}
          <div className='flex gap-6 justify-center items-start px-12 overflow-x-auto scrollbar-hide'>
            {designs.map((design) => (
              <div key={design} className='flex flex-col items-center shrink-0'>
                {/* Mobile Image */}
                <div className='mb-4'>
                  <Image 
                    src="/mobile.png" 
                    alt={`Design ${design}`} 
                    width={140} 
                    height={257}
                    className='object-contain'
                  />
                </div>
                
                {/* Design Label */}
                <h5 className='text-lg font-bold text-gray-800 mb-1'>Design {design}</h5>
                
                {/* Author */}
                <p className='text-sm text-gray-500 mb-3'>By Payuk Lee</p>
                
                {/* Icons */}
                <div className='flex gap-2'>
                  <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-[0_6px_12px_rgba(0,0,0,0.12)]'>
                    <Image 
                      src="/designssection/love.png" 
                      alt="Like" 
                      width={13} 
                      height={13}
                      className='object-contain'
                    />
                  </div>
                  <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-[0_6px_12px_rgba(0,0,0,0.12)]'>
                    <Image 
                      src="/designssection/edit.png" 
                      alt="Edit" 
                      width={13} 
                      height={13}
                      className='object-contain'
                    />
                  </div>
                  <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-[0_6px_12px_rgba(0,0,0,0.12)]'>
                    <Image 
                      src="/designssection/next.png" 
                      alt="View" 
                      width={13} 
                      height={13}
                      className='object-contain'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'
            aria-label="Next designs"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="#1A2715" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className='flex justify-center gap-0 mt-12'>
          <button
            onClick={() => setActiveFilter('trending')}
            className={`px-8 py-2 rounded-l-3xl transition-colors ${
              activeFilter === 'trending'
                ? 'bg-[#1A2715] text-white'
                : 'bg-white text-gray-700 border border-[#1A2715]'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveFilter('bestseller')}
            className={`px-8 py-2 rounded-r-3xl transition-colors ${
              activeFilter === 'bestseller'
                ? 'bg-[#1A2715] text-white'
                : 'bg-white text-gray-700 border border-[#1A2715]'
            }`}
          >
            Best Seller
          </button>
        </div>
      </div>

      {/* Package Offer Section */}
      <div className='mt-20'>
        <div className='flex items-center justify-center gap-2 mb-12'>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L9.79611 5.52786L15.6085 5.52786L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786L6.20389 5.52786L8 0Z" fill="#1A2715"/>
          </svg>
          <h4 
            className={`text-center text-[48px] ${greatVibes.variable} font-great-vibes`}
            style={{ 
              fontSize: '48px',
              fontFamily: 'Great Vibes, cursive',
              fontWeight: 'normal',
              color: '#1A2715'
            }}
          >
            Package Offer
          </h4>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L9.79611 5.52786L15.6085 5.52786L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786L6.20389 5.52786L8 0Z" fill="#1A2715"/>
          </svg>
        </div>

        {/* Packages Grid */}
        <div className='flex flex-col md:flex-row gap-6 justify-center'>
          {/* BRONZE Package */}
          <div className='flex-1 max-w-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white flex flex-col'>
            <div className='bg-orange-200 py-4 px-6'>
              <h5 className='text-[36px] font-bold text-[#36463A] text-center' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>BRONZE</h5>
            </div>
            <div className='p-6 bg-[#FBFBFB] flex flex-col grow'>
              <ul className='space-y-2 mb-6 text-gray-800 text-center grow'>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Calendar</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Contacts</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Countdown</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Navigation</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Song</li>
              </ul>
              <div className='mt-auto'>
                <div className='mb-4'>
                  <div className='w-full bg-white border border-gray-400 rounded-lg px-6 py-4 text-center'>
                    <span className='text-2xl font-bold text-gray-800'>RM30</span>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <a href="#" className='text-sm text-gray-800 hover:underline flex items-center gap-2 justify-center' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    <span className='text-[15px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Click here to view a sample</span>
                    <div className='flex items-center justify-center border border-gray-400 rounded-full w-[26px] h-[26px] bg-white'>
                      <Image src="/designssection/next.png" alt="Next" width={12} height={12} className='object-contain' />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SILVER Package */}
          <div className='flex-1 max-w-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white flex flex-col'>
            <div className='bg-gray-300 py-4 px-6'>
              <h5 className='text-[36px] font-bold text-[#36463A] text-center' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>SILVER</h5>
            </div>
            <div className='p-6 bg-[#FBFBFB] flex flex-col grow'>
              <ul className='space-y-2 mb-6 text-gray-800 text-center grow'>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Calendar</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Contacts</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Countdown</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Navigation</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Song</li>
                <li className='text-[24px] text-[#1A2715] font-semibold' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>+ Effects</li>
                <li className='text-[24px] text-[#1A2715] font-semibold' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>+ Attendance</li>
                <li className='text-[24px] text-[#1A2715] font-semibold' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>+ RSVP/Wish</li>
              </ul>
              <div className='mt-auto'>
                <div className='mb-4'>
                  <div className='w-full bg-white border border-gray-400 rounded-lg px-6 py-4 text-center'>
                    <span className='text-2xl font-bold text-gray-800'>RM50</span>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <a href="#" className='text-sm text-gray-800 hover:underline flex items-center gap-2 justify-center' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    <span className='text-[15px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Click here to view a sample</span>
                    <div className='flex items-center justify-center border border-gray-400 rounded-full w-[26px] h-[26px] bg-white'>
                      <Image src="/designssection/next.png" alt="Next" width={12} height={12} className='object-contain' />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* GOLD Package */}
          <div className='flex-1 max-w-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white flex flex-col'>
            <div className='bg-yellow-200 py-4 px-6'>
              <h5 className='text-[36px] font-bold text-[#36463A] text-center' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>GOLD</h5>
            </div>
            <div className='p-6 bg-[#FBFBFB] flex flex-col grow '>
              <ul className='space-y-2 mb-6 text-gray-800 text-center grow'>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Calendar</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Contacts</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Countdown</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Navigation</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Song</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Effects</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Attendance</li>
                <li className='text-[24px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>RSVP/Wish</li>
                <li className='text-[24px] text-[#1A2715] font-semibold' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>+ Photo Gallery</li>
                <li className='text-[24px] text-[#1A2715] font-semibold' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>+ Money Gift</li>
                <li className='text-[24px] text-[#1A2715] font-semibold' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>+ Wishlist</li>
                <li className='text-[24px] text-[#1A2715] font-semibold' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>+ Custom Link</li>
              </ul>
              <div className='mt-auto'>
                <div className='mb-4'>
                  <div className='w-full bg-white border border-gray-400 rounded-lg px-6 py-4 text-center'>
                    <span className='text-2xl font-bold text-gray-800'>RM60</span>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <a href="#" className='text-sm text-gray-800 hover:underline flex items-center gap-2 justify-center' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    <span className='text-[15px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Click here to view a sample</span>
                    <div className='flex items-center justify-center border border-gray-400 rounded-full w-[26px] h-[26px] bg-white'>
                      <Image src="/designssection/next.png" alt="Next" width={12} height={12} className='object-contain' />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Ons Section */}
      <div className='mt-20'>
        <div className='flex items-center justify-center gap-2 mb-12'>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L9.79611 5.52786L15.6085 5.52786L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786L6.20389 5.52786L8 0Z" fill="#1A2715"/>
          </svg>
          <h4 
            className={`text-center text-[48px] ${greatVibes.variable} font-great-vibes`}
            style={{ 
              fontSize: '48px',
              fontFamily: 'Great Vibes, cursive',
              fontWeight: 'normal',
              color: '#1A2715'
            }}
          >
            Add Ons
          </h4>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L9.79611 5.52786L15.6085 5.52786L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786L6.20389 5.52786L8 0Z" fill="#1A2715"/>
          </svg>
        </div>

        {/* Add Ons Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* OWN DIGITAL DESIGN */}
          <div className='border border-gray-200 bg-[#FBFBFB] rounded-lg p-6 shadow-[0_3px_6px_rgba(0,0,0,0.16)] flex flex-col items-center text-center h-full'>
            <h5 className='text-[36px] font-bold text-[#1A2715] mb-4 min-h-[60px] flex items-center justify-center'>OWN DIGITAL DESIGN</h5>
            <p className='text-[15px] text-[#36463A] mb-2 h-[20px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>From</p>
            <div className='mb-2 w-full flex justify-center'>
              <div className='bg-white px-6 py-3 rounded-2xl border border-[#707070] inline-block'>
                <span className='text-[36px] font-bold text-[#1A2715]'>+ RM20</span>
              </div>
            </div>
            <p className='text-sm text-[#36463A]'>Per Design</p>
          </div>

          {/* CARD PRINTING */}
          <div className='border border-gray-200 bg-[#FBFBFB] rounded-lg p-6 shadow-[0_3px_6px_rgba(0,0,0,0.16)] flex flex-col items-center text-center h-full'>
            <h5 className='text-[36px] font-bold text-[#1A2715] mb-4 min-h-[60px] flex items-center justify-center'>CARD PRINTING</h5>
            <p className='text-[15px] text-[#36463A] mb-2 h-[20px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>From</p>
            <div className='mb-2 w-full flex justify-center'>
              <div className='bg-white px-6 py-3 rounded-2xl border border-[#707070] inline-block'>
                <span className='text-[36px] font-bold text-[#1A2715]'>+RM0.50</span>
              </div>
            </div>
            <p className='text-sm text-[#36463A]'>Per Piece</p>
          </div>

          {/* A1 SIZE SIGNAGE */}
          <div className='border border-gray-200 bg-[#FBFBFB] rounded-lg p-6 shadow-[0_3px_6px_rgba(0,0,0,0.16)] flex flex-col items-center text-center h-full'>
            <h5 className='text-[36px] font-bold text-[#1A2715] mb-4 min-h-[60px] flex items-center justify-center'>A1 SIZE SIGNAGE</h5>
            <p className='text-[15px] text-[#36463A] mb-2 h-[20px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>From</p>
            <div className='mb-2 w-full flex justify-center'>
              <div className='bg-white px-6 py-3 rounded-2xl border border-[#707070] inline-block'>
                <span className='text-[36px] font-bold text-[#1A2715]'>+ RM30</span>
              </div>
            </div>
            <p className='text-sm text-[#36463A]'>Per Piece</p>
          </div>

          {/* TABLE TENTS */}
          <div className='border border-gray-200 bg-[#FBFBFB] rounded-lg p-6 shadow-[0_3px_6px_rgba(0,0,0,0.16)] flex flex-col items-center text-center h-full'>
            <h5 className='text-[36px] font-bold text-[#1A2715] mb-4 min-h-[60px] flex items-center justify-center'>TABLE TENTS</h5>
            <p className='text-[15px] text-[#36463A] mb-2 h-[20px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>From</p>
            <div className='mb-2 w-full flex justify-center'>
              <div className='bg-white px-6 py-3 rounded-2xl border border-[#707070] inline-block'>
                <span className='text-[36px] font-bold text-[#1A2715]'>+ RM2.50</span>
              </div>
            </div>
            <p className='text-sm text-[#36463A]'>Per Design</p>
          </div>

          {/* TABLE DISPLAY STANDS */}
          <div className='border border-gray-200 bg-[#FBFBFB] rounded-lg p-6 shadow-[0_3px_6px_rgba(0,0,0,0.16)] flex flex-col items-center text-center h-full'>
            <h5 className='text-[36px] font-bold text-[#1A2715] mb-4 min-h-[60px] flex items-center justify-center'>TABLE DISPLAY STANDS</h5>
            <p className='text-[15px] text-[#36463A] mb-2 h-[20px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>From</p>
            <div className='mb-2 w-full flex justify-center'>
              <div className='bg-white px-6 py-3 rounded-2xl border border-[#707070] inline-block'>
                <span className='text-[36px] font-bold text-[#1A2715]'>+RM29</span>
              </div>
            </div>
            <p className='text-sm text-[#36463A]'>Per Piece</p>
          </div>

          {/* BANNER SIGNAGE */}
          <div className='border border-gray-200 bg-[#FBFBFB] rounded-lg p-6 shadow-[0_3px_6px_rgba(0,0,0,0.16)] flex flex-col items-center text-center h-full'>
            <h5 className='text-[36px] font-bold text-[#1A2715] mb-4 min-h-[60px] flex items-center justify-center'>BANNER SIGNAGE</h5>
            <p className='text-[15px] text-[#36463A] mb-2 h-[20px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>From</p>
            <div className='mb-2 w-full flex justify-center'>
              <div className='bg-white px-6 py-3 rounded-2xl border border-[#707070] inline-block'>
                <span className='text-[36px] font-bold text-[#1A2715]'>RM42</span>
              </div>
            </div>
            <p className='text-sm text-[#36463A]'>Per Piece</p>
          </div>
        </div>
      </div>
    </div>
  )
}
