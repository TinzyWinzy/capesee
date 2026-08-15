import { useNavigate } from '@tanstack/react-router'
import { Button, Card } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { signOut } from '@/services/supabase/auth'

/** Guide profile. */
export function GuideProfilePage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  return (
    <div className="page-narrow">
      <div className="col" style={{ alignItems: 'center', marginBottom: 16 }}>
        <div className="avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
          {user?.fullName?.charAt(0) ?? 'G'}
        </div>
        <h1 className="section-title">{user?.fullName ?? 'Guide'}</h1>
        <span className="badge badge-accent">{user?.role ?? 'guide'}</span>
      </div>
      <Card className="stack">
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
      </Card>
    </div>
  )
}
