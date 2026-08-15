import { createFileRoute } from '@tanstack/react-router'
import { TripsHomePage } from '@/modules/trips/pages/TripsHomePage'

export const Route = createFileRoute('/_app/trips/')({
  component: TripsHomePage,
})
