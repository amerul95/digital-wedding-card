import React from 'react'
import Image from 'next/image'
import { Great_Vibes } from 'next/font/google'

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
})

export default function Introduction() {
  return (
    <div 
      className='relative py-16 px-6'
      style={{
        background: 'linear-gradient(to bottom, #36463A, #1A2715)'
      }}
    >
        <Image src="/introduction/Path494.png" className='absolute top-32 left-8' alt="Introduction" width={43} height={43} />
        <Image src="/introduction/Path495.png" className='absolute top-32 left-8' alt="Introduction" width={39} height={39} />
        <Image src="/introduction/Path496.png" className='absolute top-32 left-8' alt="Introduction" width={223} height={223} />
        <Image src="/introduction/Path499.png" className='absolute top-32 left-8' alt="Introduction" width={110} height={110} />
        <Image src="/introduction/Path500.png" className='absolute top-32 left-8' alt="Introduction" width={39} height={39} />
        <Image src="/introduction/Path501.png" className='absolute top-32 left-8' alt="Introduction" width={23} height={23} />
        <Image src="/introduction/Path502.png" className='absolute top-32 left-8' alt="Introduction" width={54} height={54} />
      <div className='max-w-7xl mx-auto relative'>
        {/* Left Decorative Stars */}
        <div className='absolute left-0 top-0 z-0'>
          <div className='relative'>
            {/* Large outlined star - upper left */}
            <Image 
              src="/introduction/Path496.png" 
              alt="" 
              width={223} 
              height={223} 
              className='absolute -top-20 -left-10'
            />
            {/* Two smaller solid stars below */}
            <Image 
              src="/introduction/Path494.png" 
              alt="" 
              width={43} 
              height={43} 
              className='absolute top-32 left-8'
            />
            <Image 
              src="/introduction/Path495.png" 
              alt="" 
              width={39} 
              height={39} 
              className='absolute top-40 left-16'
            />
          </div>
        </div>

        {/* Right Decorative Stars */}
        <div className='absolute right-0 bottom-0 z-0'>
          <div className='relative'>
            {/* Large solid star - lower right */}
            <Image 
              src="/introduction/Path499.png" 
              alt="" 
              width={110} 
              height={110} 
              className='absolute -bottom-10 -right-10'
            />
            {/* Three smaller outlined stars above */}
            <Image 
              src="/introduction/Path500.png" 
              alt="" 
              width={39} 
              height={39} 
              className='absolute -bottom-20 right-16'
            />
            <Image 
              src="/introduction/Path501.png" 
              alt="" 
              width={23} 
              height={23} 
              className='absolute -bottom-32 right-24'
            />
            <Image 
              src="/introduction/Path502.png" 
              alt="" 
              width={54} 
              height={54} 
              className='absolute -bottom-40 right-12'
            />
          </div>
        </div>

        {/* Main Content */}
        <div className='relative z-10'>
          {/* Title */}
          <div className='text-center mb-12'>
            <h2 
              className={`${greatVibes.variable} font-great-vibes text-white`}
              style={{ 
                fontSize: '48px',
                fontFamily: 'Great Vibes, cursive'
              }}
            >
              Our Specialty
            </h2>
          </div>

          {/* Icons and Text */}
          <div className='flex flex-wrap justify-center items-start gap-8 lg:gap-12'>
            {/* Icon 1: Friendly by Design */}
            <div className='flex flex-col items-center text-center w-[180px] shrink-0'>
              <div className='h-[110px] flex items-center justify-center mb-4'>
                <Image 
                  src="/introduction/Group1938.png" 
                  alt="Friendly by Design" 
                  width={110} 
                  height={110} 
                  className='object-contain'
                />
              </div>
              <div 
                className='text-white min-h-[60px] flex items-start justify-center'
                style={{ 
                  fontSize: '13px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  lineHeight: '1.4'
                }}
              >
                Friendly by design. Centered on you.
              </div>
            </div>

            {/* Icon 2: Ready-to-share Formats */}
            <div className='flex flex-col items-center text-center w-[180px] shrink-0'>
              <div className='h-[110px] flex items-center justify-center mb-4'>
                <Image 
                  src="/introduction/Group1940.png" 
                  alt="Ready-to-share Formats" 
                  width={110} 
                  height={110} 
                  className='object-contain'
                />
              </div>
              <div 
                className='text-white min-h-[60px] flex items-start justify-center'
                style={{ 
                  fontSize: '13px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  lineHeight: '1.4'
                }}
              >
                Ready-to-share formats for all social platforms.
              </div>
            </div>

            {/* Icon 3: Fast Delivery */}
            <div className='flex flex-col items-center text-center w-[180px] shrink-0'>
              <div className='h-[110px] flex items-center justify-center mb-4'>
                <Image 
                  src="/introduction/Group1942.png" 
                  alt="Fast Delivery" 
                  width={110} 
                  height={110} 
                  className='object-contain'
                />
              </div>
              <div 
                className='text-white min-h-[60px] flex items-start justify-center'
                style={{ 
                  fontSize: '13px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  lineHeight: '1.4'
                }}
              >
                Fast delivery with easy, real-time updates.
              </div>
            </div>

            {/* Icon 4: Emotional Storytelling */}
            <div className='flex flex-col items-center text-center w-[180px] shrink-0'>
              <div className='h-[110px] flex items-center justify-center mb-4'>
                <Image 
                  src="/introduction/Group1946.png" 
                  alt="Emotional Storytelling" 
                  width={110} 
                  height={110} 
                  className='object-contain'
                />
              </div>
              <div 
                className='text-white min-h-[60px] flex items-start justify-center'
                style={{ 
                  fontSize: '13px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  lineHeight: '1.4'
                }}
              >
                Emotional storytelling that makes the invitation feel truly special
              </div>
            </div>

            {/* Icon 5: Guest Management Support */}
            <div className='flex flex-col items-center text-center w-[180px] shrink-0'>
              <div className='h-[110px] flex items-center justify-center mb-4'>
                <Image 
                  src="/introduction/Group1948.png" 
                  alt="Guest Management Support" 
                  width={110} 
                  height={110} 
                  className='object-contain'
                />
              </div>
              <div 
                className='text-white min-h-[60px] flex items-start justify-center'
                style={{ 
                  fontSize: '13px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  lineHeight: '1.4'
                }}
              >
                Guest management support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
