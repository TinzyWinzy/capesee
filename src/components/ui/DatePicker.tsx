import type { ChangeEvent } from 'react'

/** Minimal date input. Wire to a real date picker in Sprint 2. */
export function DatePicker({ label, value, onChange }: { label: string; value?: string; onChange?: (value: string) => void }) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)
  return (
    <label>
      <span className="label">{label}</span>
      <input type="date" className="input" value={value} onChange={handle} />
    </label>
  )
}
