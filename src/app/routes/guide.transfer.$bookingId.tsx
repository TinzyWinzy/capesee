import { createFileRoute } from '@tanstack/react-router'
import { GuideTransferPage } from '@/modules/guide/pages/GuideTransferPage'

export const Route = createFileRoute('/guide/transfer/$bookingId')({ component: GuideTransferPage })
