import { createFileRoute } from '@tanstack/react-router'
import { CatalogDetailPage } from '@/modules/bookings/pages/CatalogPages'

export const Route = createFileRoute('/_app/book/transfers/$transferSlug')({
  component: function TransferDetailRoute() {
    const { transferSlug } = Route.useParams()
    return <CatalogDetailPage type="transfer" slug={transferSlug} />
  },
})
