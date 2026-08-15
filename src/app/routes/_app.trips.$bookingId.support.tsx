import { createFileRoute } from '@tanstack/react-router'
import { TripSupportPage } from '@/modules/trips/pages/TripSupportPage'

export const Route = createFileRoute('/_app/trips/$bookingId/support')({
  component: TripSupportPage,
})
