'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ThumbnailPreview } from './ThumbnailPreview'

interface CatalogCardProps {
  id: string
  designName: string
  designerName: string
  isFavourited: boolean
  year?: number | string
  previewImage?: string | null
}

export default function CatalogCard({
  id,
  designName,
  designerName,
  isFavourited: initialIsFavourited,
  year,
  previewImage
}: CatalogCardProps) {
  const router = useRouter()
  const [isFavourited, setIsFavourited] = useState(initialIsFavourited)

  const handleFavourite = () => {
    setIsFavourited(!isFavourited)
    // TODO: Update favourite status in database
  }

  const handleTryNow = () => {
    // Navigate to studio page with template ID
    router.push(`/studio?templateId=${id}`)
  }

  const handlePreview = () => {
    // Open preview page with template ID in new tab (for client preview)
    window.open(`/preview?templateId=${id}`, '_blank')
  }

  return (
    <div className='flex flex-col items-center'>
      {/* Mobile Phone Mockup with Card Thumbnail */}
      <div className='relative w-[118px] h-[237px] mb-3'>
        <Image 
          src="/profile/mobile.png" 
          alt="Mobile preview" 
          width={118} 
          height={237}
          className='object-contain'
        />
        {/* Card Thumbnail Preview */}
        <div className='absolute top-[14px] left-[7px] w-[104px] h-[217px] overflow-hidden rounded-[8px]'>
          <ThumbnailPreview
            templateId={id}
            previewImageUrl={previewImage}
            width={104}
            height={217}
          />
        </div>
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

        {/* Try Now Button */}
        <button
          onClick={handleTryNow}
          className='w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors'
          title="Try Now"
        >
          <Image 
            src="/favourites/edit.png" 
            alt="Try Now" 
            width={16} 
            height={16}
            className='object-contain'
          />
        </button>

        {/* Preview Button */}
        <button
          onClick={handlePreview}
          className='w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors'
          title="Preview"
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









