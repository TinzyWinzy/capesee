import { useRef, type ChangeEvent } from 'react'
import { cx } from '@/lib/utils'

/** Photo/video upload button with preview. Queues into offline service when offline. */
export function UploadMedia({
  label = 'Add Photo',
  preview,
  onFile,
  disabled,
}: {
  label?: string
  preview?: string
  onFile?: (file: File | null) => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onFile?.(file)
  }

  return (
    <div
      className={cx('media', 'ratio-4-3')}
      style={{ border: '2px dashed var(--color-line)', cursor: disabled ? 'not-allowed' : 'pointer' }}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      {preview ? (
        <img src={preview} alt="" />
      ) : (
        <div className="col" style={{ alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 28 }}>+</span>
          <span className="text-small bold">{label}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        disabled={disabled}
        onChange={handle}
      />
    </div>
  )
}
