import React from 'react'
import NavBar from '@/components/NavBar'
import Introduction from '@/components/Introduction'
import FooterPage from '@/components/FooterPage'
import DesignsSection from '@/components/DesignsSection'
import FeedBack from '@/components/FeedBack'
export default function HomePage() {
  return (
    <div >
      <NavBar/>
      <div>
      <Introduction />
      <DesignsSection />
      <FeedBack />
      </div>
      <FooterPage />
    </div>
  )
}
