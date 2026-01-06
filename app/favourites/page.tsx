import type { Metadata } from 'next'
import ProfileLayout from '@/components/profile/ProfileLayout'
import FavouriteSection from '@/components/profile/FavouriteSection'

export const metadata: Metadata = {
  title: 'Favourites - Wedding Card Creator',
  description: 'View and manage your favourite wedding card designs.',
}

export default function FavouritesPage() {
  return (
    <ProfileLayout>
      <FavouriteSection />
    </ProfileLayout>
  )
}
