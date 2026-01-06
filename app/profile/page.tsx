import type { Metadata } from 'next'
import ProfileLayout from '@/components/profile/ProfileLayout'
import ProfileSection from '@/components/profile/ProfileSection'

export const metadata: Metadata = {
  title: 'Profile - Wedding Card Creator',
  description: 'Manage your profile settings and account information.',
}

export default function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileSection />
    </ProfileLayout>
  )
}
