import { createFileRoute } from '@tanstack/react-router'
import { OfflineTicketPage } from '@/modules/trips/pages/OfflineTicketPage'
import { getBookingById } from '@/modules/bookings/api/orders'
import { ErrorState } from '@/components/ui'

export const Route = createFileRoute('/_app/trips/$bookingId/ticket')({
  component: function TripTicketRoute() {
    const { bookingId } = Route.useParams()
    const booking = getBookingById(bookingId)
    if (!booking) return <ErrorState message={`Booking ${bookingId} was not found.`} />
    return <OfflineTicketPage booking={booking} />
  },
})
