import { createFileRoute } from '@tanstack/react-router'
import { OutletLayout } from '@/app/layouts/OutletLayout'

export const Route = createFileRoute('/_app/book')({
  component: OutletLayout,
})
