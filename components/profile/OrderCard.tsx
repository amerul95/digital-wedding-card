'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface OrderCardProps {
  id: string
  title: string
  createdAt: string
  expiryDate?: string
  invitationLink: string
  designName?: string
  designerName?: string
  status?: 'pending' | 'completed' | 'cancelled'
}

export default function OrderCard({
  id,
  title,
  createdAt,
  expiryDate,
  invitationLink,
  designName = 'Design I',
  designerName = 'By Payuk Lee',
  status = 'pending'
}: OrderCardProps) {
  const [isEditingLink, setIsEditingLink] = useState(false)
  const [editedLink, setEditedLink] = useState(invitationLink)

  const handleEditLink = () => {
    setIsEditingLink(true)
  }

  const handleSaveLink = () => {
    setIsEditingLink(false)
    // TODO: Save the edited link to the database
  }

  const handlePayNow = () => {
    // TODO: Navigate to payment page
    console.log('Pay now for order:', id)
  }

  const handleEdit = () => {
    // TODO: Navigate to edit page
    console.log('Edit order:', id)
  }

  const handlePreview = () => {
    // TODO: Navigate to preview page
    window.open(invitationLink, '_blank')
  }

  const handleDelete = () => {
    // TODO: Show confirmation dialog and delete order
    console.log('Delete order:', id)
  }

  return (
    <div className='bg-white rounded-lg border border-[#CFCFCF] p-6 mb-6 flex gap-6'>
      {/* Left Side - Mobile Preview */}
      <div className='flex-shrink-0'>
        <div className='relative w-[118px] h-[237px]'>
          <Image 
            src="/profile/mobile.png" 
            alt="Mobile preview" 
            width={118} 
            height={237}
            className='object-contain'
          />
        </div>
        <div className='mt-3 text-center'>
          <p 
            className='font-bold text-gray-900 text-base mb-1'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            {designName}
          </p>
          <p 
            className='text-gray-600 text-sm'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            {designerName}
          </p>
        </div>
      </div>

      {/* Right Side - Order Details */}
      <div className='flex-1 flex flex-col'>
        {/* Three dots menu */}
        <div className='flex justify-end mb-2'>
          <button
            className='text-gray-500 hover:text-gray-700 cursor-pointer'
            onClick={() => console.log('More options')}
          >
            <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="2" cy="2" r="2" fill="currentColor"/>
              <circle cx="2" cy="8" r="2" fill="currentColor"/>
              <circle cx="2" cy="14" r="2" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Title */}
        <h2 
          className='text-2xl font-bold text-[#36463A] mb-3'
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          {title}
        </h2>

        {/* Metadata */}
        <div className='space-y-1 mb-4'>
          <p 
            className='text-gray-600 text-sm'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            Created at: {createdAt}
          </p>
          {expiryDate && (
            <p 
              className='text-gray-600 text-sm'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Expiry date: {expiryDate}
            </p>
          )}
        </div>

        {/* Invitation Link */}
        <div className='mb-6'>
          <label 
            className='block text-sm font-medium text-gray-700 mb-2'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            Your Invitation Link:
          </label>
          <div className='relative flex items-center'>
            <input
              type='text'
              value={editedLink}
              onChange={(e) => setEditedLink(e.target.value)}
              onBlur={handleSaveLink}
              disabled={!isEditingLink}
              className='w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#327442] focus:border-transparent disabled:bg-gray-50'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
            <button
              onClick={handleEditLink}
              className='absolute right-3 text-gray-500 hover:text-gray-700'
            >
                <Image src="/profile/edit.png" alt="Edit" width={16} height={16} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 flex-wrap'>
          <button
            onClick={handlePayNow}
            className='px-6 py-2.5 rounded-lg bg-[#327442] text-white font-semibold hover:bg-[#285a35] transition-colors uppercase text-sm'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            PAY NOW
          </button>
          <button
            onClick={handleEdit}
            className='px-6 py-2.5 rounded-lg bg-white text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors uppercase text-sm'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            EDIT
          </button>
          <button
            onClick={handlePreview}
            className='px-6 py-2.5 rounded-lg bg-white text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors uppercase text-sm'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            PREVIEW
          </button>
          <button
            onClick={handleDelete}
            className='px-6 py-2.5 rounded-lg bg-white text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors uppercase text-sm'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  )
}








