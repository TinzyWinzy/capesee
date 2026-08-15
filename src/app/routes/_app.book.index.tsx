import { createFileRoute } from '@tanstack/react-router'
import { BookHomePage } from '@/modules/bookings/pages/BookHomePage'

export const Route = createFileRoute('/_app/book/')({ component: BookHomePage })
