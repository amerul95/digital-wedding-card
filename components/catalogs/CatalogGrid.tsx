'use client'
import React, { useEffect, useState } from 'react'
import CatalogCard from './CatalogCard'
import axios from 'axios'

interface CatalogItem {
  id: string
  designName: string
  designerName: string
  isFavourited: boolean
  year?: number | string
  previewImage?: string | null
}

export default function CatalogGrid() {
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/catalog/templates')
        setCatalogs(response.data)
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  if (loading) {
    return (
      <div className='mt-8 rounded-[30px] bg-[#F1F8F2] p-6'>
        <div className='flex flex-col items-center justify-center min-h-[400px]'>
          <p 
            className='text-gray-900 mb-6 text-base'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            Loading templates...
          </p>
        </div>
      </div>
    )
  }

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
              year={catalog.year}
              previewImage={catalog.previewImage}
            />
          ))}
        </div>
      )}
    </div>
  )
}

