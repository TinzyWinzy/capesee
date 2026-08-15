import { createFileRoute } from '@tanstack/react-router'
import { JournalHomePage } from '@/modules/journal/pages/JournalHomePage'

export const Route = createFileRoute('/_app/journal/')({
  component: JournalHomePage,
})
