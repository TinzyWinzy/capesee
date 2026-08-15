import { createFileRoute } from '@tanstack/react-router'
import { CatalogResultsPage } from '@/modules/bookings/pages/CatalogPages'

export const Route = createFileRoute('/_app/book/stays/')({
  component: () => <CatalogResultsPage type="stay" title="Stays" />,
})
