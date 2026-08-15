import { createFileRoute } from '@tanstack/react-router'
import { CartPage } from '@/modules/bookings/pages/CartPage'

export const Route = createFileRoute('/_app/book/cart')({
  component: CartPage,
})
