/**
 * Handles Razorpay sandbox payments with a fallback option.
 *
 * If a Razorpay key VITE_RAZORPAY_KEY_ID is available, the Razorpay test checkout is opened.
 * Since there is no backend, this is a client-side test flow without
 * order creation or signature verification.
 *
 * If no Razorpay key is configured, a mock payment gateway is used
 * so the onboarding flow can still be completed.
 */

const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID as
  | string
  | undefined

export const hasRazorpayKey = (): boolean => Boolean(RAZORPAY_KEY)

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  handler: (res: { razorpay_payment_id: string }) => void
  modal?: { ondismiss?: () => void }
}

interface RazorpayInstance {
  open: () => void
  on: (event: string, cb: (res: unknown) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

let scriptPromise: Promise<boolean> | null = null

/** Lazily inject the Razorpay checkout script (once). */
export function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement('script')
    script.src = RAZORPAY_SRC
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
  return scriptPromise
}

export interface PayArgs {
  amount: number // in INR (rupees)
  partnerName: string
  brandColor: string
  description: string
  prefill?: { name?: string; email?: string; contact?: string }
}

export interface PaySuccess {
  paymentId: string
  method: string
}

/**
 * Opens Razorpay checkout. Resolves with the payment id on success; rejects
 * with Error('cancelled') if the user dismisses, or Error('failed') on error.
 */
export function payWithRazorpay(args: PayArgs): Promise<PaySuccess> {
  return loadRazorpay().then(
    (ok) =>
      new Promise<PaySuccess>((resolve, reject) => {
        if (!ok || !window.Razorpay || !RAZORPAY_KEY) {
          reject(new Error('failed'))
          return
        }

        let settled = false
        const rzp = new window.Razorpay({
          key: RAZORPAY_KEY,
          amount: Math.round(args.amount * 100), // paise
          currency: 'INR',
          name: args.partnerName,
          description: args.description,
          prefill: args.prefill,
          theme: { color: args.brandColor },
          handler: (res) => {
            settled = true
            resolve({ paymentId: res.razorpay_payment_id, method: 'razorpay' })
          },
          modal: {
            ondismiss: () => {
              if (!settled) reject(new Error('cancelled'))
            },
          },
        })
        rzp.on('payment.failed', () => {
          settled = true
          reject(new Error('failed'))
        })
        rzp.open()
      }),
  )
}

/** A human, mostly-unique reference id for the policy/receipt. */
export function makeReferenceId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `POL-${Date.now().toString(36).toUpperCase()}-${rand}`
}
