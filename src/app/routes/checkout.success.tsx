import { createFileRoute } from '@tanstack/react-router'
import { CheckoutSuccessPage } from '@/modules/checkout/pages/CheckoutSuccessPage'

export const Route = createFileRoute('/checkout/success')({
  component: CheckoutSuccessPage,
})
