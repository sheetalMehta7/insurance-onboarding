import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, useIsAuthenticated } from './authStore'

/**
 * Gate for the purchase journey. Logged-out users are redirected to /login
 * with a `returnTo` pointing at the page they wanted — so after signing in
 * they land exactly where they left off, not on the home page.
 *
 * On every navigation it revalidates the session (silently refreshing an
 * expired access token); if the session can't be revived the auth store logs
 * the user out, which flips `session` to null and triggers the redirect.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  const authed = useIsAuthenticated()
  const ensureValidSession = useAuthStore((s) => s.ensureValidSession)

  useEffect(() => {
    void ensureValidSession()
  }, [ensureValidSession, location.pathname])

  if (!authed) {
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />
  }

  return children
}
