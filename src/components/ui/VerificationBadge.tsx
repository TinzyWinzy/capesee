import { Badge } from './Badge'

/** Capesee validated this against trusted sources. See spec §42. */
export function VerificationBadge() {
  return (
    <Badge tone="success" className="bold">
      ✓ Verified
    </Badge>
  )
}
