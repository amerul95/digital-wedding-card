'use client'
import React from 'react'
import NavBar from '@/components/NavBar'
import Info from '@/components/contactus/Info'
import ContactForm from '@/components/contactus/ContactForm'

export default function page() {
  return (
    <div>
      <NavBar />
      <div className='max-w-7xl mx-auto py-12 px-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        {/* Left Side - Contact Info */}
        <div>
          <Info />
        </div>
        
        {/* Right Side - Contact Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
    </div>
  )
}
