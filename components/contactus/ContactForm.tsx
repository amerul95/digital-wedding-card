'use client'
import React, { useState } from 'react'
import Image from 'next/image'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
    readTutorials: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // TODO: Handle form submission
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, readTutorials: e.target.checked }))
  }

  return (
    <div className='w-full max-w-[480px] ml-[200px]'>
      {/* Title */}
      <h1
        className='text-2xl font-bold text-[#36463A] mb-4 text-center'
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        Contact Us
      </h1>

      {/* Intro Text */}
      <p
        className='text-gray-700 mb-6 text-left'
        style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
      >
        For any enquires or suggestion, please use this form,
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Full Name */}
        <div>
          <input
            type='text'
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            placeholder='Full Name'
            className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36463A] focus:border-transparent'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
          />
        </div>

        {/* Email Address */}
        <div>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email Address'
            className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36463A] focus:border-transparent'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
          />
        </div>

        {/* Your Messages */}
        <div>
          <textarea
            name='message'
            value={formData.message}
            onChange={handleChange}
            placeholder='Your Messages'
            rows={6}
            className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36463A] focus:border-transparent resize-none'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
          />
        </div>

        {/* Checkbox */}
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='readTutorials'
            name='readTutorials'
            checked={formData.readTutorials}
            onChange={handleCheckboxChange}
            className='w-4 h-4 rounded border-gray-300 text-[#36463A] focus:ring-[#36463A] cursor-pointer'
          />
          <label
            htmlFor='readTutorials'
            className='text-gray-700 cursor-pointer'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
          >
            I already read tutorials & FAQs
          </label>
        </div>

        {/* Send Button */}
        <div className='flex justify-end'>
          <button
            type='submit'
            className='px-6 py-3 rounded-[20px] bg-[#36463A] text-white font-semibold flex items-center gap-2 hover:bg-[#2a3d2a] transition-colors'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
          >
            Send
            <Image
              src="/contactus/send.png"
              alt="Send"
              width={12}
              height={12}
              className='object-contain'
            />
          </button>
        </div>
      </form>
    </div>
  )
}

