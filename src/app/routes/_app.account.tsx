import { createFileRoute } from '@tanstack/react-router'
import { AccountShellLayout } from '@/app/layouts/AccountShellLayout'
import { requireAuth } from '@/app/router/guards'

export const Route = createFileRoute('/_app/account')({ beforeLoad: requireAuth, component: AccountShellLayout })
