import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function FooterPage() {
  return (
    <footer
      className='py-8 px-6'
      style={{
        background: 'linear-gradient(to bottom, #36463A, #1A2715)',
        fontFamily: 'Helvetica, Arial, sans-serif'
      }}
    >
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8'>
          {/* Left Section - Logo with Star */}
          <div className='flex items-start'>
            <div className='relative'>
              <div className='flex items-start gap-1'>
                <Image
                  src="/footer/Group1933.png"
                  alt="Star"
                  width={303}
                  height={88}
                  className='object-contain mt-0.5'
                />
              </div>
            </div>
          </div>

          {/* Middle Section - Links and Copyright */}
          <div className='flex flex-col items-center lg:items-start gap-2 text-center lg:text-left'>
            <div 
              className='flex flex-wrap justify-center lg:justify-start gap-4 text-[#d3d3d3]'
              style={{ 
                fontSize: '16px',
                fontWeight: 'normal',
                fontFamily: 'Helvetica, Arial, sans-serif'
              }}
            >
              <Link href="/terms" className='hover:text-white transition-colors'>
                Terms & Condition
              </Link>
              <Link href="/privacy" className='hover:text-white transition-colors'>
                Privacy Policy
              </Link>
              <Link href="/refund" className='hover:text-white transition-colors'>
                Refund Policy
              </Link>
            </div>
            <div 
              className='text-[#d3d3d3]'
              style={{ 
                fontSize: '16px',
                fontWeight: 'normal',
                fontFamily: 'Helvetica, Arial, sans-serif'
              }}
            >
              2025 FA Design (003345063-K). All Rights Reserved.
            </div>
          </div>

          {/* Right Section - Follow Us and Social Icons */}
          <div className='flex flex items-center lg:items-end gap-3'>
            <div 
              className='text-white uppercase'
              style={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: 'Helvetica, Arial, sans-serif'
              }}
            >
              Follow Us
            </div>
            <div className='flex items-center gap-3'>
              {/* Facebook Icon */}
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Image src="/footer/facebook.png" alt="Facebook" width={32} height={32} />
              </Link>

              {/* Instagram Icon */}
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image src="/footer/instagram.png" alt="instagram" width={32} height={32} />
              </Link>

              {/* TikTok Icon */}
              <Link
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <Image src="/footer/tiktok.png" alt="tiktok" width={32} height={32} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
