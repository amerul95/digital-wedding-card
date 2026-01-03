'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLoginModal } from '@/context/LoginModalContext'

export default function NavBar() {
  const { openModal } = useLoginModal()

  const handleSignInClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    openModal()
  }
  return (
    <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-8 bg-white w-full" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Logo */}
      <div className="flex items-center flex-shrink-0">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Our Special day"
            width={180}
            height={50}
            className="h-auto"
            priority
          />
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center gap-8 flex-1 justify-center px-8">
        <Link
          href="/"
          className="bg-[#2d5016] text-white px-4 py-2 rounded-lg font-bold uppercase hover:bg-[#1f350f] transition-colors whitespace-nowrap"
          style={{ fontSize: '16px' }}
        >
          Home
        </Link>
        <Link
          href="/catalog"
          className="text-[#4a4a4a] uppercase font-bold hover:text-[#2d5016] transition-colors whitespace-nowrap"
          style={{ fontSize: '16px' }}
        >
          Catalog
        </Link>
        <Link
          href="/packages"
          className="text-[#4a4a4a] uppercase font-bold hover:text-[#2d5016] transition-colors whitespace-nowrap"
          style={{ fontSize: '16px' }}
        >
          Packages
        </Link>
        <Link
          href="/studio"
          className="text-[#4a4a4a] uppercase font-bold hover:text-[#2d5016] transition-colors whitespace-nowrap"
          style={{ fontSize: '16px' }}
        >
          Studio
        </Link>
        <Link
          href="/resources"
          className="text-[#4a4a4a] uppercase font-bold hover:text-[#2d5016] transition-colors whitespace-nowrap"
          style={{ fontSize: '16px' }}
        >
          Resources
        </Link>
        <Link
          href="/contact"
          className="text-[#4a4a4a] uppercase font-bold hover:text-[#2d5016] transition-colors whitespace-nowrap"
          style={{ fontSize: '16px' }}
        >
          Contact Us
        </Link>
      </div>

      {/* Right Side - Sign In & Profile */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="w-px h-6 bg-[#d3d3d3]"></div>
        <a
          href="#"
          onClick={handleSignInClick}
          className="text-[#4a4a4a] uppercase font-bold hover:text-[#2d5016] transition-colors cursor-pointer whitespace-nowrap"
          style={{ fontSize: '14px' }}
        >
          Sign In
        </a>
        <Link
          href="/profile"
          className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center hover:bg-[#e0e0e0] transition-colors flex-shrink-0"
          aria-label="User Profile"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4a4a4a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>
      </div>
    </nav>
  )
}
