import type { Metadata } from 'next'
import Info from '@/components/contactus/Info'
import ContactForm from '@/components/contactus/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us - Wedding Card Creator',
  description: 'Get in touch with us for support, questions, or feedback about our wedding card creator platform.',
}

export default function ContactUsPage() {
  return (
    <div className='max-w-7xl mx-auto py-12 px-6'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-5'>
        {/* Left Side - Contact Info */}
        <aside className='lg:col-span-1' aria-label="Contact information">
          <Info />
        </aside>
        
        {/* Right Side - Contact Form */}
        <div className='lg:col-span-3'>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
