import { createFileRoute } from '@tanstack/react-router'
import { CallbackPage } from '@/modules/auth/pages/AuthPages'

export const Route = createFileRoute('/auth/callback')({ component: CallbackPage })
