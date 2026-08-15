import { createFileRoute } from '@tanstack/react-router'
import { SearchPage } from '@/modules/discover/pages/SearchPage'

export const Route = createFileRoute('/_app/discover/search')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string | undefined) ?? '',
  }),
  component: SearchPage,
})
