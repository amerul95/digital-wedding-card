import React from 'react'
import TryCard from '@/components/home/TryCard'
import PreviewScaffold from '@/components/PreviewScaffold'
import Footers from '@/components/Footers'

export default function page() {
  return (
    <div >
      <div className='w-full h-[576px]'>
        <img src="#" alt="main-image" />
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
      <Footers/>
     
    </div>
  )
}
