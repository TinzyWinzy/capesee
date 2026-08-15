import { type FormEvent } from 'react'
import { cx } from '@/lib/utils'
import { Icon } from './Icon'

interface SearchBarProps {
  placeholder?: string
  defaultValue?: string
  onSubmit?: (q: string) => void
  className?: string
}

/** Global search bar. Submits to /discover/search?q=... */
export function SearchBar({ placeholder = 'Search places, tours…', defaultValue, onSubmit, className }: SearchBarProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = new FormData(e.currentTarget).get('q') as string
    onSubmit?.(input.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={cx('search-control', className)} role="search">
      <Icon name="search" className="search-control-icon" />
      <label className="sr-only" htmlFor="capesee-search">Search Capesee</label>
      <input
        id="capesee-search"
        name="q"
        className="input"
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
      <button type="submit" aria-label="Submit search"><Icon name="arrow" /></button>
    </form>
  )
}
