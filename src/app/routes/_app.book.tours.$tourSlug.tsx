import { createFileRoute } from '@tanstack/react-router'
import { TourDetailPage } from '@/modules/bookings/pages/TourDetailPage'
import { fetchProduct, getProduct } from '@/modules/bookings/api/products'
import { getSupabase } from '@/services/supabase/client'
import { useAsyncData } from '@/lib/useAsyncData'
import { ErrorState, SkeletonCard } from '@/components/ui'

export const Route = createFileRoute('/_app/book/tours/$tourSlug')({
  component: function TourDetailRoute() {
    const { tourSlug } = Route.useParams()
    const hasSupabase = Boolean(getSupabase())
    const { data: live, loading } = useAsyncData(() => hasSupabase ? fetchProduct('tour', tourSlug) : Promise.resolve(getProduct('tour', tourSlug)), [tourSlug])
    if (loading) return <SkeletonCard lines={3} />
    const tour = (hasSupabase ? live : getProduct('tour', tourSlug)) ?? getProduct('tour', tourSlug)
    // archived tours are invisible to anon via RLS — live will be undefined
    if (!tour) return <ErrorState message={`Tour "${tourSlug}" was not found or is archived.`} />
    // extra guard: hide archived walking tour even in mock fallback when live is active
    if (hasSupabase && tour.slug === 'cape-town-walking-tour') return <ErrorState message={`Tour "${tourSlug}" is archived.`} />
    return <TourDetailPage tour={tour} />
  },
})
