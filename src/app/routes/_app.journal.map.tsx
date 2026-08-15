import { createFileRoute } from '@tanstack/react-router'
import { JournalMapPage } from '@/modules/journal/pages/JournalMapPage'

export const Route = createFileRoute('/_app/journal/map')({
  component: JournalMapPage,
})
