import { createFileRoute } from '@tanstack/react-router'
import { AdminCustomerDetailPage } from '@/modules/admin/pages/AdminMiscPages'

export const Route = createFileRoute('/admin/customers/$customerId')({
  component: function CustomerDetailRoute() {
    const { customerId } = Route.useParams()
    return <AdminCustomerDetailPage customerId={customerId} />
  },
})
