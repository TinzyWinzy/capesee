import { createFileRoute } from '@tanstack/react-router'
import { ErrorState } from '@/components/ui'
import { AdminBookingDetailPage } from '@/modules/admin/pages/AdminBookingDetailPage'
import { getBookingById } from '@/modules/bookings/api/orders'

export const Route = createFileRoute('/admin/bookings/$bookingId')({
  component: function AdminBookingRoute() {
    const { bookingId } = Route.useParams()
    const booking = getBookingById(bookingId)
    return booking ? <AdminBookingDetailPage booking={booking} /> : <ErrorState message="Booking not found." />
  },
})
