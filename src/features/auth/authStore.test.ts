import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'
import { verifyOtp, DEMO_OTP } from './authService'
import { useJourneyStore } from '@/features/onboarding/journeyStore'

async function freshSession() {
  return verifyOtp('9876543210', DEMO_OTP)
}

beforeEach(() => {
  useAuthStore.setState({ session: null })
  useJourneyStore.getState().reset()
})

describe('authStore.isAuthenticated', () => {
  it('is false with no session', () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false)
  })

  it('is true after login and false once the refresh token is expired', async () => {
    const session = await freshSession()
    useAuthStore.getState().login(session)
    expect(useAuthStore.getState().isAuthenticated()).toBe(true)

    useAuthStore.setState({
      session: { ...session, refreshExpiresAt: Date.now() - 1 },
    })
    expect(useAuthStore.getState().isAuthenticated()).toBe(false)
  })
})

describe('authStore.ensureValidSession', () => {
  it('silently refreshes an expired access token when refresh is still valid', async () => {
    const session = await freshSession()
    // Access expired, refresh still valid.
    useAuthStore.getState().login({ ...session, accessExpiresAt: Date.now() - 1 })

    const ok = await useAuthStore.getState().ensureValidSession()
    expect(ok).toBe(true)
    expect(useAuthStore.getState().session!.accessExpiresAt).toBeGreaterThan(Date.now())
  })

  it('logs the user out when the refresh token has expired', async () => {
    const session = await freshSession()
    useAuthStore.getState().login({
      ...session,
      accessExpiresAt: Date.now() - 1,
      refreshExpiresAt: Date.now() - 1,
    })

    const ok = await useAuthStore.getState().ensureValidSession()
    expect(ok).toBe(false)
    expect(useAuthStore.getState().session).toBeNull()
  })
})

describe('logout', () => {
  it('clears the in-progress journey data', async () => {
    const session = await freshSession()
    useAuthStore.getState().login(session)
    useJourneyStore.getState().setKyc({ pan: 'ABCDE1234F', dateOfBirth: '1990-01-01' })
    expect(useJourneyStore.getState().kyc).not.toBeNull()

    useAuthStore.getState().logout({ silent: true })
    expect(useAuthStore.getState().session).toBeNull()
    expect(useJourneyStore.getState().kyc).toBeNull()
  })
})
