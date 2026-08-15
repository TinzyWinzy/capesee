import { createFileRoute } from '@tanstack/react-router'
import { CatalogDetailPage } from '@/modules/bookings/pages/CatalogPages'

export const Route = createFileRoute('/_app/book/stays/$hotelSlug')({
  component: function StayDetailRoute() {
    const { hotelSlug } = Route.useParams()
    return <CatalogDetailPage type="stay" slug={hotelSlug} />
  },
})
