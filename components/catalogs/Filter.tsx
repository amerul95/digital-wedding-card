'use client'
import React, { useState } from 'react'
import Image from 'next/image'

interface FilterProps {
  onApplyFilters?: (filters: any) => void
}

export default function Filter({ onApplyFilters }: FilterProps) {
  const [sortBy, setSortBy] = useState('By Latest')
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const occasions = ['All', 'Wedding', 'Birthday', 'Engagement', 'Cultural', 'Baby Shower', 'Corporate', 'Others']
  const themes = ['Floral', 'Minimalist', 'Modern', 'Traditional', 'Vintage', 'Watercolor']
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Coral', value: '#FF7F7F' },
    { name: 'Orange', value: '#FFA500' },
    { name: 'Yellow', value: '#FFFFE0' },
    { name: 'Lime Green', value: '#32CD32' },
    { name: 'Light Blue', value: '#87CEEB' },
    { name: 'Lavender', value: '#E6E6FA' },
    { name: 'White', value: '#FFFFFF' },
  ]

  const handleOccasionToggle = (occasion: string) => {
    if (occasion === 'All') {
      setSelectedOccasions(['All'])
    } else {
      setSelectedOccasions(prev => {
        const newSelection = prev.filter(item => item !== 'All')
        if (newSelection.includes(occasion)) {
          return newSelection.filter(item => item !== occasion)
        } else {
          return [...newSelection, occasion]
        }
      })
    }
  }

  const handleThemeToggle = (theme: string) => {
    setSelectedThemes(prev => {
      if (prev.includes(theme)) {
        return prev.filter(item => item !== theme)
      } else {
        return [...prev, theme]
      }
    })
  }

  const handleApplyFilters = () => {
    const filters = {
      sortBy,
      occasions: selectedOccasions,
      themes: selectedThemes,
      color: selectedColor,
    }
    onApplyFilters?.(filters)
  }

  return (
    <div className='w-[214px] max-w-[214px] min-w-[214px] flex-shrink-0 bg-white flex flex-col' style={{ fontFamily: 'Helvetica, Arial, sans-serif', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className='flex items-center gap-2 mb-6'>
        <Image src="/catalogs/settings-sliders.png" alt="Filter" width={20} height={20} />
        <h2 className='text-base font-bold text-gray-900 uppercase'>FILTERS</h2>
      </div>

      {/* Sort By Section */}
      <div className='mb-6'>
        <label className='block text-sm font-bold text-gray-900 mb-2'>Sort By</label>
        <div className='relative'>
          <input
            type='text'
            value={sortBy}
            readOnly
            className='w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 cursor-pointer pr-10'
            onClick={() => {
              // TODO: Open dropdown menu
              console.log('Open sort dropdown')
            }}
          />
          <div className='absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
            <button
              type='button'
              onClick={() => console.log('Sort up')}
              className='p-0.5 hover:opacity-70'
            >
              <Image src="/catalogs/up.png" alt="Sort up" width={8} height={8} />
            </button>
            <button
              type='button'
              onClick={() => console.log('Sort down')}
              className='p-0.5 hover:opacity-70'
            >
              <Image src="/catalogs/down.png" alt="Sort down" width={8} height={8} />
            </button>
          </div>
        </div>
      </div>

      {/* Occasions Section */}
      <div className='mb-6'>
        <label className='block text-sm font-bold text-gray-900 mb-3'>Occasions</label>
        <div className='grid grid-cols-2 gap-2'>
          {occasions.map((occasion) => (
            <label
              key={occasion}
              className='flex items-center gap-2 cursor-pointer'
            >
              <input
                type='checkbox'
                checked={selectedOccasions.includes(occasion)}
                onChange={() => handleOccasionToggle(occasion)}
                className='w-4 h-4 rounded border-gray-300 text-[#327442] focus:ring-[#327442] cursor-pointer'
              />
              <span className='text-sm text-gray-700'>{occasion}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Design Themes Section */}
      <div className='mb-6'>
        <label className='block text-sm font-bold text-gray-900 mb-3'>Design Themes</label>
        <div className='grid grid-cols-2 gap-2'>
          {themes.map((theme) => (
            <label
              key={theme}
              className='flex items-center gap-2 cursor-pointer'
            >
              <input
                type='checkbox'
                checked={selectedThemes.includes(theme)}
                onChange={() => handleThemeToggle(theme)}
                className='w-4 h-4 rounded border-gray-300 text-[#327442] focus:ring-[#327442] cursor-pointer'
              />
              <span className='text-sm text-gray-700'>{theme}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Section */}
      <div className='mb-6'>
        <label className='block text-sm font-bold text-gray-900 mb-3'>Color</label>
        <div className='grid grid-cols-4 gap-3'>
          {colors.map((color) => (
            <button
              key={color.name}
              type='button'
              onClick={() => setSelectedColor(selectedColor === color.value ? null : color.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color.value
                  ? 'border-[#327442] ring-2 ring-[#327442] ring-offset-2'
                  : color.value === '#FFFFFF'
                  ? 'border-gray-300'
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleApplyFilters}
        className='w-full py-3 px-4 rounded-lg bg-[#327442] text-white font-bold text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#285a35] transition-colors mt-auto'
      >
        Apply Filters
        <Image src="/catalogs/next.png" alt="Apply" width={14} height={14} />
      </button>
    </div>
  )
}

