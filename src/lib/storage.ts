/**
 * Namespaced, JSON-safe wrapper around localStorage.
 *
 * Every key is prefixed so the app's persisted state is easy to spot and
 * clear. All access is wrapped in try/catch because storage can throw
 * (private mode, quota, disabled cookies) — we degrade to in-memory behaviour
 * rather than crashing the journey.
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
    /* ignore write failures (quota / disabled storage) */
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
