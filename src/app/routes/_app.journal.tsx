import { createFileRoute } from '@tanstack/react-router'
import { OutletLayout } from '@/app/layouts/OutletLayout'
import { requireAuth } from '@/app/router/guards'

export const Route = createFileRoute('/_app/journal')({
  beforeLoad: requireAuth,
  component: OutletLayout,
})
