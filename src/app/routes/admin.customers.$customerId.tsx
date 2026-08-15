import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/ui'

export const Route = createFileRoute('/admin/customers/$customerId')({
  component: function CustomerDetailRoute() {
    const { customerId } = Route.useParams()
    return <PlaceholderPage title="Traveler profile" description={`Bookings and activity for ${customerId}.`} />
  },
})
