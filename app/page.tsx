import React from 'react'
import TryCard from '@/components/home/TryCard'
import PreviewScaffold from '@/components/PreviewScaffold'
import FootersLayout from '@/components/FootersLayout'
import Image from 'next/image'

export default function page() {
  return (
    <div >
      <div className='relative w-full h-[700px]'>
       <Image src="/assets/web-banner.jpg" alt="image background" fill className='object-cover' priority/>
      </div>
      <TryCard/>
      <div>
        <div>
          <p>TOP SELLINGS DESIGNS</p>
          <PreviewScaffold/>
        </div>
        <div>
          <p>BE DIFFERENT</p>
          <PreviewScaffold/>
        </div>
        <div>
          <p>FLORAL THEME</p>
          <PreviewScaffold/>
        </div>
        <div>
          <p>ISLAMIC COLLECTION</p>
          <PreviewScaffold/>
        </div>
        <div>
          <p>RUSTIC & VINTAGE</p>
          <PreviewScaffold/>
        </div>
      </div>
      <FootersLayout/>
    </div>
  )
}
