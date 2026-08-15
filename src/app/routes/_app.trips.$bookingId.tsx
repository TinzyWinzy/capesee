import { createFileRoute } from '@tanstack/react-router'
import { TripDetailPage } from '@/modules/trips/pages/TripDetailPage'
import { getBookingById } from '@/modules/bookings/api/orders'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/trips/$bookingId')({
  component: function TripDetailRoute() {
    const { bookingId } = Route.useParams()
    const booking = getBookingById(bookingId)
    if (!booking) return <ErrorState message={`Booking ${bookingId} was not found.`} />
    return <TripDetailPage booking={booking} />
  },
})
