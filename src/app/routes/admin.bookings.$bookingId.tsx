import { createFileRoute } from '@tanstack/react-router'
import { ErrorState, SkeletonCard } from '@/components/ui'
import { AdminBookingDetailPage } from '@/modules/admin/pages/AdminBookingDetailPage'
import { getBookingById } from '@/modules/bookings/api/orders'
import { getSupabase } from '@/services/supabase/client'
import { useAsyncData } from '@/lib/useAsyncData'
import { fetchBookingById } from '@/modules/bookings/api/orders'

export const Route = createFileRoute('/admin/bookings/$bookingId')({
  component: function AdminBookingRoute() {
    const { bookingId } = Route.useParams()
    const hasSupabase = Boolean(getSupabase())
    const { data: live, loading, error } = useAsyncData(() => hasSupabase ? fetchBookingById(bookingId) : Promise.resolve(getBookingById(bookingId)), [bookingId])
    if (loading) return <SkeletonCard lines={3} />
    if (error) return <ErrorState message={String(error.message ?? error)} />
    const booking = live ?? getBookingById(bookingId)
    return booking ? <AdminBookingDetailPage booking={booking} /> : <ErrorState message="Booking not found." />
  },
})
