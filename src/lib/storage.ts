/**
 * Local storage helper with app-specific keys.
 * Handles JSON parsing and storage errors safely.
 */

const PREFIX = 'ins.'

export const storageKeys = {
  partner: `${PREFIX}partner`,
  theme: `${PREFIX}theme`,
  auth: `${PREFIX}auth`,
  journey: `${PREFIX}journey`,
} as const

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
