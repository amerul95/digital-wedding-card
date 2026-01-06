'use client'

import Filter from '@/components/catalogs/Filter'
import SetNamePreview from '@/components/catalogs/SetNamePreview'
import CatalogGrid from '@/components/catalogs/CatalogGrid'

interface FilterOptions {
  category?: string
  price?: string
  style?: string
  [key: string]: unknown
}

export default function CatalogsPage() {
  const handleApplyFilters = (filters: FilterOptions) => {
    // TODO: Apply filters to the catalog items
    console.log('Applied filters:', filters)
  }

  const handleNameSet = (name: string) => {
    // TODO: Update preview with the name
    console.log('Name set for preview:', name)
  }

  return (
    <div className='max-w-7xl mx-auto py-12 px-6'>
      <div className='flex gap-6 items-start'>
        {/* Left Side - Filter */}
        <aside className='w-fit flex-shrink-0' aria-label="Filter options">
          <Filter onApplyFilters={handleApplyFilters} />
        </aside>
        
        {/* Right Side - Set Name Preview and Catalog Grid (Full Width) */}
        <div className='flex-1 w-full'>
          <SetNamePreview onNameSet={handleNameSet} />
          <CatalogGrid />
        </div>
      </div>
    </div>
  )
}
