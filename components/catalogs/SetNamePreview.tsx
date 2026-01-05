'use client'
import React, { useState } from 'react'

interface SetNamePreviewProps {
  onNameSet?: (name: string) => void
}

export default function SetNamePreview({ onNameSet }: SetNamePreviewProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onNameSet?.(name.trim())
      console.log('Name set for preview:', name.trim())
    }
  }

  return (
    <div 
      className='w-full bg-[#E8F5E9] rounded-lg p-6'
      style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
    >
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Label */}
        <label className='text-sm font-semibold text-gray-800'>
          Set Your Name for Preview
        </label>
        
        {/* Input and Button Container */}
        <div className='flex gap-3'>
          {/* Input Field */}
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Full Name'
            className='flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#327442] focus:border-transparent text-sm'
          />
          
          {/* Button */}
          <button
            type='submit'
            className='px-6 py-2.5 rounded-lg bg-[#327442] text-white font-semibold text-sm whitespace-nowrap hover:bg-[#285a35] transition-colors'
          >
            Set Your Name
          </button>
        </div>
      </form>
    </div>
  )
}


