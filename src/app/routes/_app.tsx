import { createFileRoute } from '@tanstack/react-router'
import { AppShellLayout } from '@/app/layouts/AppShellLayout'

export const Route = createFileRoute('/_app')({
  component: AppShellLayout,
})
