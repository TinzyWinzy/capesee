import { createFileRoute } from '@tanstack/react-router'
import { CheckoutLayout } from '@/app/layouts/CheckoutLayout'
import { requireAuth } from '@/app/router/guards'

export const Route = createFileRoute('/checkout')({
  beforeLoad: requireAuth,
  component: CheckoutLayout,
})
