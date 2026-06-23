import { useEffect, useRef, useState } from 'react'

/** Calls `handler` on a pointer/focus event outside the returned ref element. */
export function useClickOutside<T extends HTMLElement>(
  onOutside: () => void,
) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const handler = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [onOutside])
  return ref
}

/** Debounces a changing value. Used by the plans search box. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}
