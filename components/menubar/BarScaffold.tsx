import React from 'react'
import ByCategory from './subbar/ByCategory'
import ByTheme from './subbar/ByTheme'
import ByColor from './subbar/ByColor'

export default function BarScaffold() {
  return (
    <div className='flex justify-around'>
      <ByCategory/>
      <ByTheme/>
      <ByColor/>
    </div>
  )
}
