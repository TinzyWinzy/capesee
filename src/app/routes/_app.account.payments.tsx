import { createFileRoute } from '@tanstack/react-router'
import { PaymentsPage } from '@/modules/account/pages/PaymentsPage'

export const Route = createFileRoute('/_app/account/payments')({ component: PaymentsPage })
