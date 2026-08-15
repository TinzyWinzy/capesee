import { createFileRoute } from '@tanstack/react-router'
import { SignupPage } from '@/modules/auth/pages/AuthPages'

export const Route = createFileRoute('/auth/signup')({ component: SignupPage })
