import { createFileRoute } from '@tanstack/react-router'
import { CreateDiscoveryPage } from '@/modules/journal/pages/CreateDiscoveryPage'

export const Route = createFileRoute('/_app/journal/create')({
  component: CreateDiscoveryPage,
})
