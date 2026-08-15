import { createFileRoute } from '@tanstack/react-router'
import { DiscoverMapPage } from '@/modules/discover/pages/DiscoverMapPage'

export const Route = createFileRoute('/_app/discover/map')({
  component: DiscoverMapPage,
})
