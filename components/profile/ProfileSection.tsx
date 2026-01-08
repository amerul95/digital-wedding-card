'use client'
import React from 'react'

export default function ProfileSection() {
  return (
    <>
      {/* MY PROFILE Title */}
      <h1 
        className='text-2xl font-bold text-gray-900 mb-8 uppercase'
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        MY PROFILE
      </h1>

      {/* Personal Information Form */}
      <div className='mb-12'>
        <div className='space-y-4 max-w-2xl'>
          {/* Name Field */}
          <div>
            <label 
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-2'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              defaultValue='Faruq Razali'
              className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
          </div>

          {/* Email Address Field */}
          <div>
            <label 
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-2'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              defaultValue='faruqrazali94@gmail.com'
              disabled
              className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label 
              htmlFor='phone'
              className='block text-sm font-medium text-gray-700 mb-2'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Phone Number
            </label>
            <div className='flex gap-3'>
              <select
                id='country'
                className='px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                <option>Country</option>
                <option>Malaysia (+60)</option>
              </select>
              <input
                type='tel'
                id='phone'
                defaultValue='60123456789'
                className='flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              />
            </div>
          </div>

          {/* Update Button */}
          <div className='pt-4'>
            <button
              type='button'
              className='w-full px-6 py-3 rounded-lg bg-[#327442] text-white font-semibold uppercase hover:bg-[#285a35] transition-colors'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              UPDATE
            </button>
          </div>
        </div>
      </div>

      {/* Password Update Form */}
      <div>
        <div className='space-y-4 max-w-2xl'>
          {/* Current Password Field */}
          <div>
            <label 
              htmlFor='currentPassword'
              className='block text-sm font-medium text-gray-700 mb-2'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Current Password
            </label>
            <input
              type='password'
              id='currentPassword'
              className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
          </div>

          {/* New Password Field */}
          <div>
            <label 
              htmlFor='newPassword'
              className='block text-sm font-medium text-gray-700 mb-2'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label 
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-2'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Confirm New Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
          </div>

          {/* Update Button */}
          <div className='pt-4'>
            <button
              type='button'
              className='w-full px-6 py-3 rounded-lg bg-[#327442] text-white font-semibold uppercase hover:bg-[#285a35] transition-colors'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              UPDATE
            </button>
          </div>
        </div>
      </div>
    </>
  )
}










