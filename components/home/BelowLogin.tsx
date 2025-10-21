import React from 'react'
import Image from 'next/image'

export default function BelowLogin() {
  return (
                   <div className='flex'>
                 <div className='flex'>
                  <a href="">
                    <Image src="/assets/deal.png" alt="deals" width={39} height={32}/>
                     <p>DEALS!</p>
                   </a>
                   <a href="#">
                     <Image src="/assets/vendor.png" alt="deals" width={39} height={32}/>
                     <p>VENDORS!</p>
                   </a>
                 </div>
                 <div className='flex justify-center w-full'>
                   <a href="/">
                     <img src="#" alt="home logo" />
                   </a>
                 </div>
               </div>
  )
}
