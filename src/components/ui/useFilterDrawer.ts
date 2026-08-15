import { useState } from 'react'

/** Convenience hook for the filter drawer's open state. */
export function useFilterDrawer() {
  const [open, setOpen] = useState(false)
  return { open, toggle: () => setOpen((value) => !value), close: () => setOpen(false) }
}
