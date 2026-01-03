'use client'
import React from 'react'
import Image from 'next/image'
import { useLoginModal } from '@/context/LoginModalContext'

export default function LoginModal() {
  const { isOpen, closeModal } = useLoginModal()

  if (!isOpen) return null

  return (
    <div 
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      onClick={closeModal}
    >
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/50' />
      
      {/* Modal Content */}
      <div 
        className='relative z-10 w-[800px] h-[451px] rounded-[20px] bg-white overflow-hidden flex shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className='absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 transition-colors shadow-md'
          aria-label="Close modal"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      {/* Left Section - Illustration */}
      <div className='w-[400px] h-full flex items-center justify-center bg-gray-50'>
        <Image 
          src="/login/Group2213.png" 
          alt="Login Illustration" 
          width={318} 
          height={234} 
          className='object-contain' 
          quality={100}
        />
      </div>

      {/* Right Section - Login Form */}
      <div className='w-[400px] h-full flex flex-col justify-center items-center px-6 py-6'>
        <div className='w-full max-w-[320px]'>
          {/* LOGIN Title */}
          <h2 
            className='text-2xl font-bold text-gray-900 mb-5 uppercase text-center'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            LOGIN
          </h2>

          {/* Email Input */}
          <div className='mb-3'>
            <input
              type="email"
              placeholder="Email Address"
              className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
          </div>

          {/* Password Input */}
          <div className='mb-3'>
            <input
              type="password"
              placeholder="Password"
              className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
          </div>

          {/* LOGIN Button */}
          <button
            className='w-full py-2.5 rounded-lg bg-[#1A2715] text-white font-semibold uppercase mb-3 hover:bg-[#2a3d2a] transition-colors text-sm'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            LOGIN
          </button>

          {/* Forgot Password Link */}
          <div className='mb-4 text-center'>
            <a 
              href="#" 
              className='text-xs text-gray-700 hover:text-gray-900'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Forgot password?
            </a>
          </div>

          {/* OR Separator */}
          <div className='relative mb-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-xs'>
              <span 
                className='bg-white px-2 text-gray-500'
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                OR
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            className='w-full py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mb-4 text-sm'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            {/* Google Logo */}
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.467 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65454 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65454 3.57955 9 3.57955Z" fill="#EA4335"/>
            </svg>
            <span>SIGN IN WITH GOOGLE</span>
          </button>

          {/* Register Link */}
          <div className='text-center'>
            <span 
              className='text-xs text-gray-600'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Don't have an account?{' '}
              <a 
                href="#" 
                className='text-gray-900 underline font-medium hover:text-gray-700'
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                Register Now
              </a>
            </span>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
