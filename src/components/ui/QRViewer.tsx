import { useEffect, useState } from 'react'
import { Card } from './Card'
import { OfflineBadge } from './OfflineBadge'

/**
 * QR code renderer. Uses a lightweight textual/svg fallback so the scaffold
 * runs without extra deps; swap for a real QR lib in Sprint 2.
 */
export function QRViewer({ value, size = 160 }: { value: string; size?: number }) {
  const [hash, setHash] = useState('')

  useEffect(() => {
    let h = 0
    for (const ch of value) h = (h * 31 + ch.charCodeAt(0)) >>> 0
    setHash(h.toString(16).padStart(8, '0'))
  }, [value])

  const cells = Array.from(hash).map((c) => parseInt(c, 16)).slice(0, 5)

  return (
    <Card className="col" style={{ alignItems: 'center', gap: 12, padding: 20 }}>
      <div
        aria-label={`QR code for ${value}`}
        style={{
          width: size,
          height: size,
          background: '#fff',
          border: '1px solid var(--color-line)',
          borderRadius: 8,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 2,
          padding: 4,
        }}
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: cells.includes(i % 5) || cells.includes(Math.floor(i / 5)) ? 'var(--color-ink)' : '#f6f4ee',
              borderRadius: 1,
            }}
          />
        ))}
      </div>
      <OfflineBadge />
    </Card>
  )
}
