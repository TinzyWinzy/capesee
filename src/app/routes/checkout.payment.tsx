import { createFileRoute } from '@tanstack/react-router'
import { CheckoutPaymentPage } from '@/modules/checkout/pages/CheckoutPaymentPage'

export const Route = createFileRoute('/checkout/payment')({
  component: CheckoutPaymentPage,
})
