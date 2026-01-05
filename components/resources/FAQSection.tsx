'use client'
import React, { useState } from 'react'
import Image from 'next/image'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: 'How to order? Can I order a digital card via WhatsApp?',
    answer: 'We advise creating your own digital card on our website since our system was designed so that users may generate their own cards. Please refer to tutorials here.'
  },
  {
    question: 'How long does it take for the e-card to be ready?',
    answer: 'The card will be ready immediately after you fill in the information at the Studio. Please refer to tutorials here.'
  },
  {
    question: 'Does One Special Day provide packages with physical card?',
    answer: 'Sorry, for now we only offer digital cards. For physical cards package, you can contact our partners. Please refer to this post.'
  },
  {
    question: 'After I make a payment, can I change my card details?',
    answer: 'For six months following the payment date, you may modify your card as often as you like.'
  },
  {
    question: "After I make a payment, can I change my card's design / theme?",
    answer: 'For six months following the payment date, you may change it as often as you like.'
  },
  {
    question: 'How long will my card be usable after a purchase has been made?',
    answer: 'Your digital card link will be usable for a year, but after six months from the date of payment, you won\'t be able to make changes to it.'
  },
  {
    question: 'Is the payment one-time only or one payment per guest?',
    answer: 'The payment is one-time only, and it can be shared among many guests.'
  },
  {
    question: 'What is the guest limit for each card created?',
    answer: 'There is no guest limit for each card. You can share it with as many people as you like.'
  },
  {
    question: 'Can I use my own music or are there any specific songs that are already set?',
    answer: 'Yes, you can use any song available on YouTube. Just paste the YouTube link, set the start time & you\'re done!'
  },
  {
    question: 'Can I use my own design?',
    answer: 'Yes, you can use your own design for an additional fee of RM10. Please follow this tutorial.'
  },
  {
    question: 'What language is supported on this digital card?',
    answer: 'Our digital card supports Malay and English language.'
  },
  {
    question: 'Does the digital card have dual language support?',
    answer: 'Our digital card only partially supports dual language. Please refer to this tutorial.'
  },
  {
    question: 'Can I upgrade my card package or add-on after payment is made?',
    answer: 'Yes you can upgrade your card from the dashboard. Click 3 dots icon > Upgrade'
  },
  {
    question: 'Can I auto play a song without an open button?',
    answer: 'Sorry, internet browsers (Chrome, Safari, etc.) restrict an audio or video from being played without a user touch gesture.'
  },
  {
    question: 'Why does the music on my card sometimes not play properly?',
    answer: 'There are two possibilities:\n1. The web browser does not support autoplay.\n2. The user accesses the Studio/card too frequently, causing YouTube to flag the user as spam/bot. Solution: Wait a few minutes before trying again or log in to a Google account on the browser.'
  },
  {
    question: 'Does this digital card have a limit on how many people it can be shared with?',
    answer: 'The invitation does not limit the number of shares for the ecard link.'
  },
  {
    question: 'Where is the RSVP stored? How can I view the attendance?',
    answer: 'RSVP is stored in the Invitation system and can be accessed through the dashboard. RSVPs can be edited and downloaded as a Google Sheet. Please refer to this tutorial.'
  },
  {
    question: 'Can this digital card be used for 2-3 couples or parents?',
    answer: 'Yes, it can, no problem. Please refer to this tutorial.'
  },
  {
    question: 'Can I export my digital card as a PDF printing?',
    answer: 'Yes, you can download it as a PDF, but it\'s for screen size and not suitable for printing. Maybe you can ask the printing staff to edit it first for printing purposes. PDF sample here.'
  },
  {
    question: 'If I already have a PDF digital card, can I convert it to a digital card link by One Special Day?',
    answer: 'Yes, you can convert the PDF to an image first before uploading it, similar to this tutorial. If you don\'t have image editing skills, you can contact the admin. There\'s an additional charge of RM10 for the \'Own Design\' add-on.'
  },
  {
    question: 'I am having trouble deleting / uploading images for the gallery / gifts. How can I fix this?',
    answer: 'Sorry for the inconvenience. You can try logging out > logging back in > trying again. If it persists, contact the admin.'
  }
]

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First FAQ open by default

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className='mt-12 w-full max-w-4xl'>
      {/* Search Input */}
      <div className='mb-8 flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white'>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search FAQ...'
          className='flex-1 px-4 py-3 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none border-0'
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        />
        <button
          type='button'
          className='flex-shrink-0 p-3 border-l border-gray-300 hover:bg-gray-50 transition-colors'
        >
          <Image
            src="/resources/search.png"
            alt="Search"
            width={20}
            height={20}
            className='object-contain'
          />
        </button>
      </div>
      
      {/* FAQ List */}
      <div className='space-y-0 border border-gray-200 rounded-lg overflow-hidden bg-white'>
        {filteredFAQs.map((faq, index) => {
          const isOpen = openIndex === index
          const originalIndex = faqData.indexOf(faq) + 1
          
          return (
            <div
              key={index}
              className='border-b border-gray-200 last:border-b-0'
            >
              {/* Question */}
              <button
                onClick={() => handleToggle(index)}
                className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors'
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
              >
                <span className='flex-1 pr-4 font-normal text-gray-900'>
                  {originalIndex}. {faq.question}
                </span>
                <div className='flex-shrink-0'>
                  {isOpen ? (
                    <Image
                      src="/resources/minus.png"
                      alt="Collapse"
                      width={18}
                      height={18}
                      className='object-contain'
                    />
                  ) : (
                    <Image
                      src="/resources/add.png"
                      alt="Expand"
                      width={18}
                      height={18}
                      className='object-contain'
                    />
                  )}
                </div>
              </button>
              
              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div 
                  className='px-4 pb-4 pt-0 text-gray-700 font-bold'
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
                >
                  {faq.answer.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className='mb-2 last:mb-0'>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

