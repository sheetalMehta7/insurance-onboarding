import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storageKeys } from '@/lib/storage'
import { refreshAccess } from './authService'
import type { Session } from './authService'
import { useJourneyStore } from '@/features/onboarding/journeyStore'
import { toast } from '@/features/notifications/toast'

interface AuthState {
  session: Session | null
  /** Sync check: logged in if a session exists and the refresh token is valid. */
  isAuthenticated: () => boolean
  login: (session: Session) => void
  logout: (opts?: { expired?: boolean; silent?: boolean }) => void
  /**
   * Ensure a usable access token, silently refreshing if it has expired.
   * Returns false (and logs the user out) if the session can't be revived.
   */
  ensureValidSession: () => Promise<boolean>
}

// Guards against concurrent refreshes from multiple protected routes mounting.
let refreshInFlight: Promise<boolean> | null = null

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,

      isAuthenticated: () => {
        const s = get().session
        return Boolean(s && s.refreshExpiresAt > Date.now())
      },

      login: (session) => set({ session }),

      logout: ({ expired = false, silent = false } = {}) => {
        set({ session: null })
        // Logging out clears the user's data: wipe any in-progress purchase.
        useJourneyStore.getState().reset()
        if (expired) toast.error('Your session expired. Please sign in again.')
        else if (!silent) toast.info('You have been signed out.')
      },

      ensureValidSession: () => {
        const s = get().session
        if (!s) return Promise.resolve(false)

        const now = Date.now()
        if (s.refreshExpiresAt <= now) {
          get().logout({ expired: true })
          return Promise.resolve(false)
        }
        if (s.accessExpiresAt > now) return Promise.resolve(true)

        // Access token expired but refresh is valid → silent refresh.
        if (!refreshInFlight) {
          refreshInFlight = refreshAccess(s.refreshToken)
            .then(({ accessToken, accessExpiresAt }) => {
              const current = get().session
              if (current) set({ session: { ...current, accessToken, accessExpiresAt } })
              return true
            })
            .catch(() => {
              get().logout({ expired: true })
              return false
            })
            .finally(() => {
              refreshInFlight = null
            })
        }
        return refreshInFlight
      },
    }),
    {
      name: storageKeys.auth,
      storage: createJSONStorage(() => localStorage),
      // Only the session is persisted (functions are recreated on load).
      partialize: (s) => ({ session: s.session }),
    },
  ),
)

/**
 * Reactive auth check for components. The `Date.now()` freshness comparison
 * lives in the store method (not a component/hook body), keeping render pure.
 */
export const useIsAuthenticated = () =>
  useAuthStore((s) => s.isAuthenticated())
