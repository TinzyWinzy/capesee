import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/modules/auth/pages/AuthPages'

export const Route = createFileRoute('/auth/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' && search.redirect.startsWith('/') ? search.redirect : undefined,
  }),
  component: LoginPage,
})
