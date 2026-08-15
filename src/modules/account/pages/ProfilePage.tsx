import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'
import { Button, Card } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { signOut, updateProfile } from '@/services/supabase/auth'
import type { Role } from '@/types'

/** Account profile + dev role switcher (lets reviewers test guide/admin). */
export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const devSignIn = useAuthStore((s) => s.devSignIn)
  const navigate = useNavigate()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    setFullName(user?.fullName ?? '')
    setPhone(user?.phone ?? '')
  }, [user?.fullName, user?.phone])

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setMessage(undefined)
    const result = await updateProfile({ fullName, phone })
    setBusy(false)
    setMessage(result.ok ? 'Profile saved.' : result.error)
  }

  return (
    <div className="page-narrow">
      <div className="col" style={{ alignItems: 'center', marginBottom: 20 }}>
        <div className="avatar" style={{ width: 72, height: 72, fontSize: 28 }}>
          {user?.fullName?.charAt(0) ?? '?'}
        </div>
        <h1 className="section-title" style={{ fontSize: 20 }}>
          {user?.fullName ?? 'Guest'}
        </h1>
        <span className="badge badge-accent">{user?.role ?? 'not signed in'}</span>
      </div>

      <div className="stack">
        <Card>
          <form className="stack" onSubmit={save}>
            <label>
              <span className="label">Full name</span>
              <input className="input" value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required />
            </label>
            <label>
              <span className="label">Email</span>
              <input className="input" value={user?.email ?? ''} autoComplete="email" disabled />
            </label>
            <label>
              <span className="label">Phone</span>
              <input className="input" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" />
            </label>
            {message ? <p role="status" className="text-small" style={{ margin: 0 }}>{message}</p> : null}
            <Button type="submit" variant="primary" block disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</Button>
          </form>
        </Card>

        {import.meta.env.DEV ? (
          <div className="card">
            <div className="eyebrow">Development role switcher</div>
            <div className="row wrap" style={{ marginTop: 8 }}>
              {(['traveler', 'guide', 'admin'] as Role[]).map((role) => (
                <button key={role} className={user?.role === role ? 'chip chip-active' : 'chip'} onClick={() => devSignIn(role)}>
                  {role}
                </button>
              ))}
            </div>
            <p className="text-faint text-xs" style={{ marginTop: 8 }}>
              Available only in local development. Supabase RLS remains authoritative.
            </p>
          </div>
        ) : null}

        <Button
          variant="outline"
          block
          onClick={async () => {
            await signOut()
            navigate({ to: '/discover' })
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  )
}
