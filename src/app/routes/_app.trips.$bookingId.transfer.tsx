import { createFileRoute } from '@tanstack/react-router'
import { TripTransferPage } from '@/modules/trips/pages/TripTransferPage'
import { getBookingById } from '@/modules/bookings/api/orders'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/trips/$bookingId/transfer')({
  component: function TripTransferRoute() {
    const { bookingId } = Route.useParams()
    const booking = getBookingById(bookingId)
    if (!booking) return <ErrorState message={`Booking ${bookingId} was not found.`} />
    return <TripTransferPage booking={booking} />
  },
})
