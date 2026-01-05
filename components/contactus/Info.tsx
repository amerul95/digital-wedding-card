import React from 'react'
import Image from 'next/image'

interface ContactInfoItem {
  icon: string
  lines: string[]
  link?: string
}

const contactInfo: ContactInfoItem[] = [
  {
    icon: '/contactus/marker.png',
    lines: ['Subang Jaya, Selangor', '(No Physical Store)']
  },
  {
    icon: '/contactus/envelope-dot.png',
    lines: ['onespecialday@gmail.com'],
    link: 'mailto:onespecialday@gmail.com'
  },
  {
    icon: '/contactus/whatsapp-circle.png',
    lines: ['+60-175403919 (WhatsApp only)'],
    link: 'https://wa.me/60175403919'
  },
  {
    icon: '/contactus/clock.png',
    lines: ['Monday to Friday - 10 AM to 5 PM', 'Weekends & Public Holidays - Closed']
  }
]

export default function Info() {
  return (
    <div className='w-full'>
      {/* Company Name Header */}
      <h1
        className='text-2xl font-bold text-gray-900 mb-8'
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        FA Design (003345063-K)
      </h1>

      {/* Contact Information List */}
      <div className='space-y-6'>
        {contactInfo.map((item, index) => (
          <div
            key={index}
            className='flex items-start gap-4'
          >
            {/* Icon */}
            <div className='flex-shrink-0 mt-1'>
              <Image
                src={item.icon}
                alt=""
                width={20}
                height={20}
                className='object-contain'
              />
            </div>
            
            {/* Text Content */}
            <div className='flex-1'>
              {item.lines.map((line, lineIndex) => {
                const isSecondary = lineIndex > 0
                const content = item.link && lineIndex === 0 ? (
                  <a
                    href={item.link}
                    target={item.link.startsWith('http') ? '_blank' : undefined}
                    rel={item.link.startsWith('http') ? 'noreferrer' : undefined}
                    className='text-gray-900 hover:text-[#36463A] transition-colors inline-block'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
                  >
                    {line}
                  </a>
                ) : (
                  <span
                    className='text-gray-900 inline-block'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
                  >
                    {line}
                  </span>
                )

                return (
                  <p
                    key={lineIndex}
                    className={isSecondary ? '' : ''}
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
                  >
                    {content}
                  </p>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
