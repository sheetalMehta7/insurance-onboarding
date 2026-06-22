import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useThemeStore } from './themeStore'

/** Updates the dark class based on the current theme. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return children
}
