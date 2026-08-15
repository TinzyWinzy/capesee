import { createFileRoute } from '@tanstack/react-router'
import { TripItineraryPage } from '@/modules/trips/pages/TripItineraryPage'
import { getBookingById } from '@/modules/bookings/api/orders'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/trips/$bookingId/itinerary')({
  component: function TripItineraryRoute() {
    const { bookingId } = Route.useParams()
    const booking = getBookingById(bookingId)
    if (!booking) return <ErrorState message={`Booking ${bookingId} was not found.`} />
    return <TripItineraryPage booking={booking} />
  },
})
