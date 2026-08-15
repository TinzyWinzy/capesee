import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/ui'

export const Route = createFileRoute('/_app/journal/feed')({
  component: () => <PlaceholderPage title="Journal Feed" description="Social feed of traveler discoveries." note="§19" />,
})
