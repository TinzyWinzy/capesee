import { createFileRoute } from '@tanstack/react-router'
import { CheckoutFailedPage } from '@/modules/checkout/pages/CheckoutFailedPage'

export const Route = createFileRoute('/checkout/failed')({
  component: CheckoutFailedPage,
})
