import { createFileRoute } from '@tanstack/react-router'
import { TripsListPage } from '@/modules/trips/pages/TripsListPage'

export const Route = createFileRoute('/_app/trips/upcoming')({
  component: () => <TripsListPage mode="upcoming" />,
})
