import { createFileRoute } from '@tanstack/react-router'
import { VerifyPage } from '@/modules/auth/pages/AuthPages'

export const Route = createFileRoute('/auth/verify')({ component: VerifyPage })
