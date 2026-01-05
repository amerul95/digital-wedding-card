import React from 'react'
import Info from '@/components/contactus/Info'
import ContactForm from '@/components/contactus/ContactForm'

export default function page() {
  return (
    <div className='max-w-7xl mx-auto py-12 px-6'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-5'>
        {/* Left Side - Contact Info */}
        <div className='lg:col-span-1'>
          <Info />
        </div>
        
        {/* Right Side - Contact Form */}
        <div className='lg:col-span-3'>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
