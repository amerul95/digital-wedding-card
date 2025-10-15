import React from 'react'
import TryCard from '@/components/home/TryCard'
import PreviewScaffold from '@/components/PreviewScaffold'
import Footers from '@/components/Footers'

export default function page() {
  return (
    <div >
<div
  className="w-full h-[60vh] md:h-[80vh] bg-cover bg-center bg-no-repeat relative"
  style={{ backgroundImage: "url('https://nikahsatu.com/wp-content/uploads/2024/12/ns-banner-min-scaled-1.webp')" }}
>
  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
    <h1 className="text-white text-4xl font-bold">Welcome to NikahSatu</h1>
  </div>
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
