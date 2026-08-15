import { createFileRoute } from '@tanstack/react-router'
import { CheckoutDetailsPage } from '@/modules/checkout/pages/CheckoutDetailsPage'

export const Route = createFileRoute('/checkout/details')({
  component: CheckoutDetailsPage,
})
