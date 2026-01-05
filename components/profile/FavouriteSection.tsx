'use client'
import React from 'react'
import Image from 'next/image'
import FavouriteCard from './FavouriteCard'

interface FavouriteItem {
  id: string
  designName: string
  designerName: string
  isFavourited: boolean
}

// Mock data - Replace with actual data from your API/database
const mockFavourites: FavouriteItem[] = [
  {
    id: '1',
    designName: 'Design A',
    designerName: 'By Payuk Lee',
    isFavourited: true
  },
  {
    id: '2',
    designName: 'Design B',
    designerName: 'By Payuk Lee',
    isFavourited: false
  },
  {
    id: '3',
    designName: 'Design C',
    designerName: 'By Payuk Lee',
    isFavourited: true
  },
  {
    id: '4',
    designName: 'Design D',
    designerName: 'By Payuk Lee',
    isFavourited: true
  },
]

export default function FavouriteSection() {
  const favourites = mockFavourites // Replace with actual data fetching

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <h1 
          className='text-2xl font-bold text-gray-900 uppercase'
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          FAVOURITES
        </h1>
        {favourites.length > 0 && (
          <button
            className='flex items-center gap-3 px-6 py-3 rounded-lg border border-[#327442] bg-white text-[#327442] hover:bg-[#327442] hover:text-white transition-colors'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-6 h-6 flex items-center justify-center'>
              <Image src="/profile/add.png" alt="Add" width={24} height={24} />
            </div>
            <span className='font-medium'>Browse Designs</span>
          </button>
        )}
      </div>
      
      {favourites.length === 0 ? (
        /* Empty State */
        <div className='flex flex-col items-center justify-center min-h-[400px]'>
          <p 
            className='text-gray-900 mb-6 text-base'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            No favourite yet.
          </p>
          <button
            className='flex items-center gap-3 px-6 py-3 rounded-lg border border-[#327442] bg-white text-[#327442] hover:bg-[#327442] hover:text-white transition-colors'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-6 h-6 flex items-center justify-center'>
              <Image src="/profile/add.png" alt="Add" width={24} height={24} />
            </div>
            <span className='font-medium'>Browse Designs</span>
          </button>
        </div>
      ) : (
        /* Favourites List */
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {favourites.map((favourite) => (
            <FavouriteCard
              key={favourite.id}
              id={favourite.id}
              designName={favourite.designName}
              designerName={favourite.designerName}
              isFavourited={favourite.isFavourited}
            />
          ))}
        </div>
      )}
    </div>
  )
}

