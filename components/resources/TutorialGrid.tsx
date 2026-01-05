'use client'
import React from 'react'
import TutorialCard from './Card'

interface TutorialItem {
  text: string
  boldText?: string
  icon?: string
}

// All 18 tutorial cards based on screenshot
const tutorialItems: TutorialItem[] = [
  // Column 1
  { text: 'HOW TO', boldText: 'SETUP YOUR ACCOUNT', icon: '/resources/setupaccount.png' },
  { text: 'RSVP / WISHES', boldText: 'GUIDELINE', icon: '/resources/rsvp.png' },
  { text: 'CUSTOMIZED ORDER', boldText: 'GUIDELINES', icon: '/resources/customized.png' },
  { text: 'HOW TO', boldText: 'CHANGE WHATSAPP PREVIEW IMAGE', icon: '/resources/whatsapp.png' },
  { text: 'LOCATION', boldText: 'SHARING', icon: '/resources/multiplevenue.png' },
  { text: 'HOW TO', boldText: 'UPGRADE YOUR CARD', icon: '/resources/upgrade.png' },
  { text: 'HOW TO', boldText: 'INSERT MULTIPLE LANGUAGE IN CARD', icon: '/resources/translate.png' },
  { text: 'HOW TO', boldText: 'ADD MULTIPLE EVENT DATE IN CARD', icon: '/resources/event.png' },
  
  // Column 2
  { text: 'HOW TO', boldText: 'CREATE YOUR CARD', icon: '/resources/createcard.png' },
  { text: 'HOW TO', boldText: 'MONITOR YOUR RSVP', icon: '/resources/monitorrsvp.png' },
  { text: 'HOW TO', boldText: 'FIT MULTIPLE PEOPLE IN YOUR INVITE', icon: '/resources/multiplepeople.png' },
  { text: 'HOW TO', boldText: 'ADD MULTIPLE VENUE IN YOUR CARD', icon: '/resources/multiplevenue.png' },
  { text: 'HOW TO', boldText: 'UPLOAD MOTION VIDEO TO YOUR CARD', icon: '/resources/uploadmotion.png' },
  { text: 'HOW TO', boldText: 'UPLOAD GIFT LIST', icon: '/resources/giftlist.png' },
  { text: 'HOW TO', boldText: 'USE GALLERY FEATURE', icon: '/resources/gallery.png' },
  { text: 'HOW TO', boldText: 'FIT MULTIPLE ORGANIZER IN AN INVITE', icon: '/resources/multipleorganizer.png' },
  
  // Column 3 (bottom row)
  { text: 'HOW TO', boldText: 'ADD A THIRD-PARTY RSVP FORM IN YOUR CARD', icon: '/resources/thirdparty.png' },
]

export default function TutorialGrid() {
  return (
    <div className='mt-12 w-full'>
      {/* Grid with 2 columns */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {tutorialItems.map((item, index) => (
          <TutorialCard
            key={index}
            text={item.text}
            boldText={item.boldText}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  )
}

