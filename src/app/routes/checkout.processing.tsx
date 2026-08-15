import { createFileRoute } from '@tanstack/react-router'
import { CheckoutProcessingPage } from '@/modules/checkout/pages/CheckoutProcessingPage'

export const Route = createFileRoute('/checkout/processing')({
  component: CheckoutProcessingPage,
})
