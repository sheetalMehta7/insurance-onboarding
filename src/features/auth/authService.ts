/**
 * Mock authentication service that mimics a real token-based backend.
 *
 * It issues a short-lived access token and a long-lived refresh token, both
 * carrying an expiry. This lets us implement a genuine silent-refresh flow and
 * "expired/invalid session" handling without a backend. Swap these functions
 * for real `/auth/login`, `/auth/refresh`, `/auth/me` calls and the rest of the
 * app is unchanged.
 */

export interface AuthUser {
  id: string
  name: string
  phone: string
}

export interface Session {
  user: AuthUser
  accessToken: string
  refreshToken: string
  accessExpiresAt: number
  refreshExpiresAt: number
}

/** Short access TTL keeps the refresh path easy to observe/demo. */
export const ACCESS_TTL_MS = 10 * 60 * 1000 // 10 minutes
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
export const DEMO_OTP = '123456'

const LATENCY_MS = 500
const delay = (ms = LATENCY_MS) => new Promise((r) => setTimeout(r, ms))

interface TokenPayload {
  sub: string
  type: 'access' | 'refresh'
  exp: number
}

// Fake "JWT": base64url(JSON). Not secure — purely to simulate token shape.
function encodeToken(payload: TokenPayload): string {
  return btoa(JSON.stringify(payload)).replace(/=+$/, '')
}

function decodeToken(token: string): TokenPayload | null {
  try {
    return JSON.parse(atob(token)) as TokenPayload
  } catch {
    return null
  }
}

function nameFromPhone(phone: string): string {
  return `Customer ${phone.slice(-4)}`
}

/** "Send" an OTP. In this mock, the code is always DEMO_OTP. */
export async function requestOtp(phone: string): Promise<void> {
  await delay()
  // A real backend would dispatch an SMS here.
}

/** Verify the OTP and mint a session. Throws on an incorrect code. */
export async function verifyOtp(phone: string, code: string): Promise<Session> {
  await delay()
  if (code !== DEMO_OTP) {
    throw new Error('That code is incorrect. Try again.')
  }
  const now = Date.now()
  const user: AuthUser = { id: `u_${phone}`, name: nameFromPhone(phone), phone }
  return {
    user,
    accessToken: encodeToken({ sub: user.id, type: 'access', exp: now + ACCESS_TTL_MS }),
    refreshToken: encodeToken({ sub: user.id, type: 'refresh', exp: now + REFRESH_TTL_MS }),
    accessExpiresAt: now + ACCESS_TTL_MS,
    refreshExpiresAt: now + REFRESH_TTL_MS,
  }
}

/** Exchange a valid refresh token for a fresh access token. */
export async function refreshAccess(
  refreshToken: string,
): Promise<{ accessToken: string; accessExpiresAt: number }> {
  await delay(250)
  const payload = decodeToken(refreshToken)
  if (!payload || payload.type !== 'refresh' || payload.exp < Date.now()) {
    throw new Error('Refresh token expired')
  }
  const now = Date.now()
  return {
    accessToken: encodeToken({ sub: payload.sub, type: 'access', exp: now + ACCESS_TTL_MS }),
    accessExpiresAt: now + ACCESS_TTL_MS,
  }
}
