import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui'
import {
  completeAuthCallback,
  sendPasswordReset,
  signInWithEmail,
  signInWithProvider,
  signUpWithEmail,
} from '@/services/supabase/auth'

function AuthError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="text-small" style={{ color: '#a13d2d', margin: 0 }}>
      {message}
    </p>
  ) : null
}

/** Auth — email/password and configured OAuth providers. */
export function LoginPage() {
  const navigate = useNavigate()
  const { redirect } = useSearch({ from: '/auth/login' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    const form = new FormData(event.currentTarget)
    const result = await signInWithEmail(String(form.get('email')).trim(), String(form.get('password')))
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    await navigate({ to: (redirect ?? '/discover') as never })
  }

  const socialSignIn = async (provider: 'google' | 'apple') => {
    setBusy(true)
    setError(undefined)
    const result = await signInWithProvider(provider)
    if (!result.ok) {
      setBusy(false)
      setError(result.error)
    }
  }

  return (
    <div className="stack">
      <h1 className="section-title" style={{ fontSize: 20 }}>Welcome back</h1>

      <div className="row wrap" style={{ gap: 10 }}>
        <button className="btn btn-outline" style={{ flex: 1 }} disabled={busy} onClick={() => void socialSignIn('google')}>
          Continue with Google
        </button>
        <button className="btn btn-outline" style={{ flex: 1 }} disabled={busy} onClick={() => void socialSignIn('apple')}>
          Continue with Apple
        </button>
      </div>

      <div className="hairline" />
      <form className="stack" onSubmit={submit}>
        <label>
          <span className="label">Email</span>
          <input className="input" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label>
          <span className="label">Password</span>
          <input className="input" name="password" type="password" autoComplete="current-password" required />
        </label>
        <AuthError message={error} />
        <Link to="/auth/forgot-password" className="text-small bold" style={{ color: 'var(--color-accent-strong)' }}>
          Forgot password?
        </Link>
        <Button type="submit" variant="primary" block disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-faint text-small" style={{ textAlign: 'center', margin: 0 }}>
        New to Capesee?{' '}
        <Link to="/auth/signup" className="bold" style={{ color: 'var(--color-accent-strong)' }}>Create account</Link>
      </p>
      <Link to="/discover" className="btn btn-ghost btn-sm" style={{ alignSelf: 'center' }}>Browse as guest</Link>
    </div>
  )
}

export function SignupPage() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password'))
    const confirmation = String(form.get('password-confirmation'))
    if (password !== confirmation) {
      setBusy(false)
      setError('Passwords do not match.')
      return
    }

    const result = await signUpWithEmail(
      String(form.get('full-name')).trim(),
      String(form.get('email')).trim(),
      password,
    )
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    await navigate({ to: result.needsVerification ? '/auth/verify' : '/discover' })
  }

  return (
    <div className="stack">
      <h1 className="section-title" style={{ fontSize: 20 }}>Create your account</h1>
      <p className="text-faint text-small">
        Browse as a guest, then create an account when you’re ready to book, save and journal.
      </p>
      <form className="stack" onSubmit={submit}>
        <label>
          <span className="label">Full name</span>
          <input className="input" name="full-name" autoComplete="name" required />
        </label>
        <label>
          <span className="label">Email</span>
          <input className="input" name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span className="label">Password</span>
          <input className="input" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <label>
          <span className="label">Confirm password</span>
          <input className="input" name="password-confirmation" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <AuthError message={error} />
        <Button type="submit" variant="primary" block disabled={busy}>{busy ? 'Creating account…' : 'Sign up'}</Button>
      </form>
      <p className="text-faint text-small" style={{ textAlign: 'center', margin: 0 }}>
        Already have an account?{' '}
        <Link to="/auth/login" search={{ redirect: undefined }} className="bold" style={{ color: 'var(--color-accent-strong)' }}>Sign in</Link>
      </p>
    </div>
  )
}

export function VerifyPage() {
  return (
    <div className="stack">
      <h1 className="section-title" style={{ fontSize: 20 }}>Check your email</h1>
      <p className="text-faint text-small">
        We sent a secure confirmation link to your email address. Open it to activate your Capesee account.
      </p>
      <Link to="/auth/login" search={{ redirect: undefined }} className="btn btn-primary">Return to sign in</Link>
    </div>
  )
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    const form = new FormData(event.currentTarget)
    const result = await sendPasswordReset(String(form.get('email')).trim())
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setSent(true)
  }

  return (
    <div className="stack">
      <h1 className="section-title" style={{ fontSize: 20 }}>Reset password</h1>
      {sent ? (
        <p role="status" className="text-faint text-small">Check your email for the secure reset link.</p>
      ) : (
        <form className="stack" onSubmit={submit}>
          <label>
            <span className="label">Email</span>
            <input className="input" name="email" type="email" autoComplete="email" required />
          </label>
          <AuthError message={error} />
          <Button type="submit" variant="primary" block disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</Button>
        </form>
      )}
      <Link to="/auth/login" search={{ redirect: undefined }} className="text-small bold" style={{ color: 'var(--color-accent-strong)' }}>
        ← Back to sign in
      </Link>
    </div>
  )
}

/** Auth callback for OAuth, email confirmation, and password-recovery links. */
export function CallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let active = true
    void completeAuthCallback().then(async (result) => {
      if (!active) return
      if (!result.ok) {
        setError(result.error)
        return
      }
      const next = new URLSearchParams(window.location.search).get('next')
      await navigate({ to: (next?.startsWith('/') ? next : '/discover') as never })
    })
    return () => {
      active = false
    }
  }, [navigate])

  return (
    <div className="state" aria-live="polite">
      <div className="state-title">{error ? 'Sign-in could not be completed' : 'Completing sign-in…'}</div>
      <AuthError message={error} />
      {error ? <Link to="/auth/login" search={{ redirect: undefined }} className="btn btn-primary">Return to sign in</Link> : null}
    </div>
  )
}
