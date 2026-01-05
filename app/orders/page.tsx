import React from 'react'
import ProfileLayout from '@/components/profile/ProfileLayout'
import OrdersSection from '@/components/profile/OrdersSection'

export default function page() {
  return (
    <ProfileLayout>
      <OrdersSection />
    </ProfileLayout>
  )
}
