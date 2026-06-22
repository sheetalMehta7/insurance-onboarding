import { create } from 'zustand'
import { storageKeys } from '@/lib/storage'

export type Theme = 'light' | 'dark'

/**
 * Returns the saved theme or falls back to the system theme.
 */
function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(storageKeys.theme)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* storage unavailable */
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return 'light'
}

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    try {
      localStorage.setItem(storageKeys.theme, theme)
    } catch {
      /* ignore */
    }
    set({ theme })
  },
  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
}))
