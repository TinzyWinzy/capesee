import { createFileRoute } from '@tanstack/react-router'
import { TripsListPage } from '@/modules/trips/pages/TripsListPage'

export const Route = createFileRoute('/_app/trips/past')({
  component: () => <TripsListPage mode="past" />,
})
