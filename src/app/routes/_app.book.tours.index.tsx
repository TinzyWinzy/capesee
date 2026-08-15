import { createFileRoute } from '@tanstack/react-router'
import { TourResultsPage } from '@/modules/bookings/pages/TourResultsPage'

export const Route = createFileRoute('/_app/book/tours/')({ component: TourResultsPage })
