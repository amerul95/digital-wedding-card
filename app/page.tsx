import React from 'react'
import NavBar from '@/components/NavBar'
import Introduction from '@/components/Introduction'
import FooterPage from '@/components/FooterPage'

export default function HomePage() {
  return (
    <div >
      <NavBar />
      <div>
      <Introduction />
      </div>
      <FooterPage />
    </div>
  )
}
