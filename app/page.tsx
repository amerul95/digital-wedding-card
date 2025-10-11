import React from 'react'
import TopAlert from '@/components/home/TopAlert'
import LoginandCart from '@/components/home/LoginandCart'
import BarScaffold from '@/components/menubar/BarScaffold'
import TryCard from '@/components/home/TryCard'

export default function page() {
  return (
    <div className='max-w-6xl m-auto'>
      <TopAlert/>
      <LoginandCart/>
      <div className='flex'>
        <div className='flex'>
          <a href="">
            <img src="#" alt="deals" />
            <p>DEALS!</p>
          </a>
          <a href="#">
            <img src="" alt="Vendor" />
            <p>VENDORS!</p>
          </a>
        </div>
        <div className='flex justify-center w-full'>
          <a href="#">
            <img src="#" alt="home logo" />
          </a>
        </div>
      </div>
      <BarScaffold/>
      <div className='w-full h-[576px]'>
        <img src="#" alt="main-image" />
      </div>
      <TryCard/>
    </div>
  )
}
