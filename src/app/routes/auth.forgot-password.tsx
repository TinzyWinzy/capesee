import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordPage } from '@/modules/auth/pages/AuthPages'

export const Route = createFileRoute('/auth/forgot-password')({ component: ForgotPasswordPage })
