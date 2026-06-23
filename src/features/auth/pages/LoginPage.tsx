import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Field, TextInput } from '@/components/ui/form'
import { useAuthStore, useIsAuthenticated } from '../authStore'
import { requestOtp, verifyOtp, DEMO_OTP } from '../authService'
import { phoneSchema, otpSchema } from '@/features/onboarding/schemas'
import { toast } from '@/features/notifications/toast'

type Phase = 'phone' | 'otp'

export default function LoginPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const authed = useIsAuthenticated()
  const login = useAuthStore((s) => s.login)

  const returnTo = params.get('returnTo')
  const safeReturnTo = returnTo && returnTo.startsWith('/') ? returnTo : '/'

  const [phase, setPhase] = useState<Phase>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Already signed in → skip login and honour the intended destination.
  if (authed) {
    return <Navigate to={safeReturnTo} replace />
  }

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = phoneSchema.safeParse(phone)
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    setError(null)
    setBusy(true)
    try {
      await requestOtp(parsed.data)
      setPhone(parsed.data)
      setPhase('otp')
      toast.info(`OTP sent. Use ${DEMO_OTP} for this demo.`)
    } catch {
      setError('Could not send the code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = otpSchema.safeParse(code)
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    setError(null)
    setBusy(true)
    try {
      const newSession = await verifyOtp(phone, parsed.data)
      login(newSession)
      toast.success('Signed in successfully.')
      navigate(safeReturnTo, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-fg">
          {phase === 'phone' ? 'Sign in to continue' : 'Verify your number'}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          {phase === 'phone'
            ? 'Enter your mobile number and we’ll send you a one-time code.'
            : `We sent a 6-digit code to +91 ${phone}.`}
        </p>

        {returnTo && (
          <p className="mt-3 rounded-lg bg-brand-soft px-3 py-2 text-xs text-brand">
            You’ll return to your purchase right after signing in.
          </p>
        )}

        {phase === 'phone' ? (
          <form onSubmit={submitPhone} className="mt-6 flex flex-col gap-4" noValidate>
            <Field label="Mobile number" htmlFor="phone" error={error ?? undefined} required>
              <TextInput
                id="phone"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="9876543210"
                maxLength={10}
                value={phone}
                invalid={Boolean(error)}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </Field>
            <Button type="submit" fullWidth isLoading={busy}>
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={submitOtp} className="mt-6 flex flex-col gap-4" noValidate>
            <Field
              label="One-time code"
              htmlFor="otp"
              error={error ?? undefined}
              hint={`Demo code: ${DEMO_OTP}`}
              required
            >
              <TextInput
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                maxLength={6}
                value={code}
                invalid={Boolean(error)}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </Field>
            <Button type="submit" fullWidth isLoading={busy}>
              Verify &amp; continue
            </Button>
            <button
              type="button"
              className="text-sm font-medium text-brand hover:underline"
              onClick={() => {
                setPhase('phone')
                setCode('')
                setError(null)
              }}
            >
              ← Change number
            </button>
          </form>
        )}
      </Card>
    </div>
  )
}
