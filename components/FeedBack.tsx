'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Great_Vibes } from 'next/font/google'

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
})

export default function FeedBack() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const testimonials = [
    {
      name: 'Wan Ismail',
      location: 'Ipoh, Perak',
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
    },
    {
      name: 'Wan Ismail',
      location: 'Ipoh, Perak',
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
    },
    {
      name: 'Wan Ismail',
      location: 'Ipoh, Perak',
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
    }
  ]

  return (
    <div 
      style={{
        background: 'linear-gradient(to bottom, rgba(191, 158, 123, 0.34), rgba(191, 158, 123, 0))'
      }}
    >
      <div className='max-w-7xl mx-auto py-12 px-6'>
        {/* Title */}
        <div className='mb-12'>
          <h4 
            className={`text-center text-[48px] ${greatVibes.variable} font-great-vibes`}
            style={{ 
              fontSize: '48px',
              fontFamily: 'Great Vibes, cursive',
              fontWeight: 'normal',
              color: '#1A2715'
            }}
          >
            Happy Customers
          </h4>
        </div>

        {/* Testimonial Cards Carousel */}
        <div className='flex justify-center gap-6 mb-8 overflow-x-auto scrollbar-hide'>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className='shrink-0 w-full max-w-[368px] h-[240px] bg-white rounded-[30px] p-6 shadow-sm'
            >
              <div className='flex flex-col gap-4'>
                <div className='flex justify-between items-center'>
                  <p className='font-bold text-gray-800 text-[20px] mb-1' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{testimonial.name}</p>
                  <p className='text-gray-500 text-[12px]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{testimonial.location}</p>
                </div>
                <div className='text-gray-700 text-[15px] leading-relaxed'>
                  &quot;{testimonial.quote}&quot;
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Indicators */}
        <div className='flex justify-center gap-2 mb-8'>
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index % testimonials.length)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === 0
                  ? 'bg-[#BF9E7B]'
                  : 'bg-[#1A2715]'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* VIEW MORE Button */}
        <div className='flex justify-center'>
          <button className='flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors'>
            <span className='text-[15px] font-medium' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              VIEW MORE
            </span>
            <div className='flex items-center justify-center rounded-full w-6 h-6 '>
              <Image 
                src="/designssection/Group1915.png" 
                alt="Next" 
                width={10} 
                height={10} 
                className='object-contain' 
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
