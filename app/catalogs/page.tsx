'use client'
import React from 'react'
import NavBar from '@/components/NavBar'
import Filter from '@/components/catalogs/Filter'
import SetNamePreview from '@/components/catalogs/SetNamePreview'
import CatalogGrid from '@/components/catalogs/CatalogGrid'

export default function page() {
  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters)
    // TODO: Apply filters to the catalog items
  }

  const handleNameSet = (name: string) => {
    console.log('Name set for preview:', name)
    // TODO: Update preview with the name
  }

  return (
    <div>
      <NavBar />
      <div className='max-w-7xl mx-auto py-12 px-6'>
      <div className='flex gap-6 items-start'>
        {/* Left Side - Filter */}
        <div className='w-fit flex-shrink-0'>
          <Filter onApplyFilters={handleApplyFilters} />
        </div>
        
        {/* Right Side - Set Name Preview and Catalog Grid (Full Width) */}
        <div className='flex-1 w-full'>
          <SetNamePreview onNameSet={handleNameSet} />
          <CatalogGrid />
        </div>
      </div>
    </div>
    </div>
  )
}
