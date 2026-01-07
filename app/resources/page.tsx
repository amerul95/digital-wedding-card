'use client'
import React, { useState } from 'react'
import NavBar from '@/components/NavBar'
import ResourcesTab from '@/components/resources/ResourcesTab'
import TutorialGrid from '@/components/resources/TutorialGrid'
import FAQSection from '@/components/resources/FAQSection'

type TabType = 'tutorial' | 'faq'

export default function page() {
  const [activeTab, setActiveTab] = useState<TabType>('tutorial')

  return (
    <div>
      <NavBar />
      <div className='max-w-7xl mx-auto py-12 px-6'>
        <ResourcesTab activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'tutorial' ? <TutorialGrid /> : <FAQSection />}
      </div>
    </div>
  )
}
