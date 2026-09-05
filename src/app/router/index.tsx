import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ErrorState, EmptyState, Button } from '@/components/ui'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPendingMs: 200,
  defaultErrorComponent: ({ error, reset }) => {
    const offline = typeof navigator !== 'undefined' && !navigator.onLine
    const msg = offline
      ? 'You are offline — retry when back online.'
      : String(error ?? 'Something went wrong.')
    return <ErrorState message={msg} onRetry={reset} />
  },
  defaultNotFoundComponent: () => (
    <EmptyState
      icon="◌"
      title="Nothing here"
      description="The page you're looking for doesn't exist."
      action={
        <Button variant="primary" onClick={() => router.navigate({ to: '/discover' })}>
          Back to Discover
        </Button>
      }
    />
  ),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
