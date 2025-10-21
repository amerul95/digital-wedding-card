import React from 'react'
import CardCatalog from '../features/CardCatalog'

const data = [
  {
    title: "Ethereal Swirl Gradient",
    description: "Smooth, flowing gradients blending rich reds and blues in an abstract swirl.",
    image: "https://cdn.shadcnstudio.com/ss-assets/components/card/image-2.png?height=280&format=auto",
    link:"theme"
  },
  {
    title: "Solar Bloom Spectrum",
    description: "A radiant blend of orange, yellow, and pink tones evoking sunrise warmth and energy.",
    image: "https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png?height=280&format=auto",
    link:"category"
  },
  {
    title: "Midnight Pulse Wave",
    description: "Deep blues and purples merge with electric highlights, creating a futuristic pulse effect.",
    image: "https://cdn.shadcnstudio.com/ss-assets/components/card/image-4.png?height=280&format=auto",
    link:"color"
  }
]


export default function page() {
  return (
    <div>
      <CardCatalog data={data}/>
    </div>
  )
}
