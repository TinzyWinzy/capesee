import { useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | undefined
  error: Error | undefined
  loading: boolean
}

/** Minimal async loader hook with loading/error/data states. */
export function useAsyncData<T>(loader: () => Promise<T>, deps: ReadonlyArray<unknown> = []): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: undefined, loading: true })

  useEffect(() => {
    let active = true
    setState({ data: undefined, error: undefined, loading: true })
    loader()
      .then((data) => {
        if (active) setState({ data, error: undefined, loading: false })
      })
      .catch((err: unknown) => {
        if (active) setState({ data: undefined, error: err instanceof Error ? err : new Error(String(err)), loading: false })
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
