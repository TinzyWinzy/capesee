import { createFileRoute } from '@tanstack/react-router'
import { NearbyPage } from '@/modules/discover/pages/NearbyPage'

export const Route = createFileRoute('/_app/discover/nearby')({
  component: NearbyPage,
})
