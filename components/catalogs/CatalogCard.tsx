'use client'
import React, { useState } from 'react'
import Image from 'next/image'

interface CatalogCardProps {
  id: string
  designName: string
  designerName: string
  isFavourited: boolean
  year?: number | string
}

export default function CatalogCard({
  id,
  designName,
  designerName,
  isFavourited: initialIsFavourited,
  year
}: CatalogCardProps) {
  const [isFavourited, setIsFavourited] = useState(initialIsFavourited)

  const handleFavourite = () => {
    setIsFavourited(!isFavourited)
    // TODO: Update favourite status in database
  }

  const handleEdit = () => {
    // TODO: Navigate to edit page
    console.log('Edit design:', id)
  }

  const handlePreview = () => {
    // TODO: Navigate to preview page
    console.log('Preview design:', id)
  }

  return (
    <div className='flex flex-col items-center'>
      {/* Mobile Phone Mockup */}
      <div className='relative w-[118px] h-[237px] mb-3'>
        <Image 
          src="/profile/mobile.png" 
          alt="Mobile preview" 
          width={118} 
          height={237}
          className='object-contain'
        />
      </div>

      {/* Design Name */}
      <p 
        className='font-bold text-gray-900 text-base mb-1'
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        {designName}
      </p>

      {/* Year - Between design name and designer name */}
      {year && (
        <p 
          className='text-gray-700 text-sm mb-1 font-medium'
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          {year}
        </p>
      )}

      {/* Designer Name */}
      <p 
        className='text-gray-600 text-sm mb-4'
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        {designerName}
      </p>

      {/* Action Icons */}
      <div className='flex items-center gap-3'>
        {/* Favourite Heart Icon */}
        <button
          onClick={handleFavourite}
          className='w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors'
        >
          {isFavourited ? (
            <Image 
              src="/favourites/favourite.png" 
              alt="Favourite" 
              width={16} 
              height={16}
              className='object-contain'
            />
          ) : (
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M8 2.74805L7.3525 2.10055C5.5925 0.340549 2.6675 0.340549 0.9075 2.10055C-0.8525 3.86055 -0.8525 6.78555 0.9075 8.54555L8 15.6381L15.0925 8.54555C16.8525 6.78555 16.8525 3.86055 15.0925 2.10055C13.3325 0.340549 10.4075 0.340549 8.6475 2.10055L8 2.74805Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className='text-gray-700'
              />
            </svg>
          )}
        </button>

        {/* Edit Icon */}
        <button
          onClick={handleEdit}
          className='w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors'
        >
          <Image 
            src="/favourites/edit.png" 
            alt="Edit" 
            width={16} 
            height={16}
            className='object-contain'
          />
        </button>

        {/* Preview/Next Icon */}
        <button
          onClick={handlePreview}
          className='w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors'
        >
          <Image 
            src="/favourites/next.png" 
            alt="Preview" 
            width={16} 
            height={16}
            className='object-contain'
          />
        </button>
      </div>
    </div>
  )
}









