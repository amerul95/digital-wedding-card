import type { Metadata } from 'next'
import Cart from '@/components/cart/Cart'

export const metadata: Metadata = {
  title: 'Shopping Cart - Wedding Card Creator',
  description: 'Review your selected wedding card designs and proceed to checkout.',
}

export default function CartPage() {
  return (
    <div>
      <Cart />
    </div>
  )
}
