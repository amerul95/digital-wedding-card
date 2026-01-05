'use client'
import React from 'react'
import CatalogCard from './CatalogCard'

interface CatalogItem {
  id: string
  designName: string
  designerName: string
  isFavourited: boolean
}

// Mock data - Replace with actual data from your API/database
// Based on screenshot: Design E through Design L (8 designs)
const mockCatalogs: CatalogItem[] = [
  {
    id: '1',
    designName: 'Design E',
    designerName: 'By Payuk Lee',
    isFavourited: false
  },
  {
    id: '2',
    designName: 'Design F',
    designerName: 'By Payuk Lee',
    isFavourited: false
  },
  {
    id: '3',
    designName: 'Design G',
    designerName: 'By Payuk Lee',
    isFavourited: false
  },
  {
    id: '4',
    designName: 'Design H',
    designerName: 'By Payuk Lee',
    isFavourited: false
  },
  {
    id: '5',
    designName: 'Design I',
    designerName: 'By Payuk Lee',
    isFavourited: false
  },
  {
    id: '6',
    designName: 'Design J',
    designerName: 'By Payuk Lee',
    isFavourited: false
  },
  {
    id: '7',
    designName: 'Design K',
    designerName: 'By Payuk Lee',
    isFavourited: false
  },
  {
    id: '8',
    designName: 'Design L',
    designerName: 'By Payuk Lee',
    isFavourited: false
  },
]

export default function CatalogGrid() {
  const catalogs = mockCatalogs // Replace with actual data fetching

  return (
    <div className='mt-8 rounded-[30px] bg-[#F1F8F2] p-6'>
      {catalogs.length === 0 ? (
        /* Empty State */
        <div className='flex flex-col items-center justify-center min-h-[400px]'>
          <p 
            className='text-gray-900 mb-6 text-base'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            No designs available.
          </p>
        </div>
      ) : (
        /* Catalog Grid */
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {catalogs.map((catalog) => (
            <CatalogCard
              key={catalog.id}
              id={catalog.id}
              designName={catalog.designName}
              designerName={catalog.designerName}
              isFavourited={catalog.isFavourited}
            />
          ))}
        </div>
      )}
    </div>
  )
}

