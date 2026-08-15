/** Format a number as South African Rand. */
export function formatRand(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(input: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof input === 'string' ? new Date(input) : input
  return date.toLocaleDateString('en-ZA', opts ?? { day: 'numeric', month: 'short', year: 'numeric' })
}

export function timeAgo(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  const seconds = Math.round((Date.now() - date.getTime()) / 1000)
  const units: Array<[number, string]> = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.348, 'week'],
    [12, 'month'],
  ]
  let value = seconds
  let unit = 'second'
  for (const [size, name] of units) {
    if (value < size) {
      unit = name
      break
    }
    value = Math.floor(value / size)
    unit = name
  }
  if (value === 1 && unit === 'second') return 'just now'
  return `${value} ${unit}${value === 1 ? '' : 's'} ago`
}

export function distanceLabel(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}
