'use client'
import React, { useState } from 'react'
import Image from 'next/image'

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favourites'>('profile')

  return (
    <div className='max-w-7xl mx-auto min-h-screen flex px-10'>
      {/* Left Sidebar Navigation */}
      <div className='w-64 bg-white flex flex-col py-8'>
        {/* Navigation Items */}
        <div className='flex-1'>
          {/* MY PROFILE */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              activeTab === 'profile'
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5'>
              <Image src="/profile/profile.png" alt="Profile" width={20} height={20} />
            </div>
            <span className='font-semibold uppercase text-sm'>MY PROFILE</span>
          </button>

          {/* ORDERS */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              activeTab === 'orders'
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5'>
              <Image src="/profile/orders.png" alt="Orders" width={20} height={20} />
            </div>
            <span className='font-semibold uppercase text-sm'>ORDERS</span>
          </button>

          {/* FAVOURITES */}
          <button
            onClick={() => setActiveTab('favourites')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              activeTab === 'favourites'
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5'>
              <Image src="/profile/favourites.png" alt="Favourites" width={20} height={20} />
            </div>
            <span className='font-semibold uppercase text-sm'>FAVOURITES</span>
          </button>
        </div>

        {/* LOG OUT */}
        <div className='px-6 py-4'>
          <button
            className='w-full flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5'>
              <Image src="/profile/logout.png" alt="Logout" width={20} height={20} />
            </div>
            <span className='font-semibold uppercase text-sm'>LOG OUT</span>
          </button>
        </div>
      </div>

      {/* Right Main Content Area */}
      <div className='flex-1 bg-white py-8 px-8 border border-[#CFCFCF] my-[29px] mx-[22px] rounded-[15px]'>
        {activeTab === 'profile' && (
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
        )}

        {activeTab === 'orders' && (
          <div>
            <h1 
              className='text-2xl font-bold text-gray-900 mb-8 uppercase'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              ORDERS
            </h1>
            <p className='text-gray-600' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Your orders will appear here.
            </p>
          </div>
        )}

        {activeTab === 'favourites' && (
          <div>
            <h1 
              className='text-2xl font-bold text-gray-900 mb-8 uppercase'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              FAVOURITES
            </h1>
            <p className='text-gray-600' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Your favourites will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
