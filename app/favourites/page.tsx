import React from 'react'
import ProfileLayout from '@/components/profile/ProfileLayout'
import FavouriteSection from '@/components/profile/FavouriteSection'

export default function page() {
  return (
    <ProfileLayout>
      <FavouriteSection />
    </ProfileLayout>
  )
}

