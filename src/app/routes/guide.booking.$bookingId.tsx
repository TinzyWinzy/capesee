import { createFileRoute } from '@tanstack/react-router'
import { ErrorState } from '@/components/ui'
import { getBookingById } from '@/modules/bookings/api/orders'
import { GuideBookingDetailPage } from '@/modules/guide/pages/GuideBookingDetailPage'

export const Route = createFileRoute('/guide/booking/$bookingId')({
  component: function GuideBookingRoute() {
    const { bookingId } = Route.useParams()
    const booking = getBookingById(bookingId)
    return booking ? <GuideBookingDetailPage booking={booking} /> : <ErrorState message="Booking not found." />
  },
})
