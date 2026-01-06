'use client'

import { useState } from 'react'
import ResourcesTab from '@/components/resources/ResourcesTab'
import TutorialGrid from '@/components/resources/TutorialGrid'
import FAQSection from '@/components/resources/FAQSection'

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'faq'>('tutorial')

  return (
    <div className='max-w-7xl mx-auto py-12 px-6'>
      <div className='flex flex-col items-center w-full'>
        <ResourcesTab activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'tutorial' ? <TutorialGrid /> : <FAQSection />}
      </div>
    </div>
  )
}
