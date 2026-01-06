import type { Metadata } from 'next'
import ProfileLayout from '@/components/profile/ProfileLayout'
import OrdersSection from '@/components/profile/OrdersSection'

export const metadata: Metadata = {
  title: 'Orders - Wedding Card Creator',
  description: 'View and manage your wedding card orders.',
}

export default function OrdersPage() {
  return (
    <ProfileLayout>
      <OrdersSection />
    </ProfileLayout>
  )
}
