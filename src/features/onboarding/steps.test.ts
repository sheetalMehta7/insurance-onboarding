import { describe, it, expect } from 'vitest'
import { maxReachableIndex, resolveAllowedStep } from './steps'
import type { JourneyProgress } from './steps'

const none: JourneyProgress = {
  kyc: false,
  personal: false,
  nominee: false,
  reviewConfirmed: false,
  payment: false,
}

describe('maxReachableIndex', () => {
  it('only kyc (index 0) is reachable for a fresh journey', () => {
    expect(maxReachableIndex(none)).toBe(0)
  })
  it('unlocks steps strictly in order', () => {
    expect(maxReachableIndex({ ...none, kyc: true })).toBe(1)
    expect(maxReachableIndex({ ...none, kyc: true, personal: true })).toBe(2)
    expect(
      maxReachableIndex({ ...none, kyc: true, personal: true, nominee: true }),
    ).toBe(3)
    expect(
      maxReachableIndex({
        kyc: true,
        personal: true,
        nominee: true,
        reviewConfirmed: true,
        payment: false,
      }),
    ).toBe(4)
    expect(
      maxReachableIndex({
        kyc: true,
        personal: true,
        nominee: true,
        reviewConfirmed: true,
        payment: true,
      }),
    ).toBe(5)
  })
  it('does not unlock a later step if an earlier one is missing', () => {
    // Nominee done but personal missing → still stuck at kyc-unlocked (1 max).
    expect(maxReachableIndex({ ...none, kyc: true, nominee: true })).toBe(1)
  })
})

describe('resolveAllowedStep (step guard)', () => {
  it('redirects a jump-ahead to the furthest unlocked step', () => {
    expect(resolveAllowedStep('payment', { ...none, kyc: true })).toBe('personal')
  })
  it('allows navigating to an already-unlocked step', () => {
    const progress = { ...none, kyc: true, personal: true }
    expect(resolveAllowedStep('personal', progress)).toBe('personal')
    expect(resolveAllowedStep('kyc', progress)).toBe('kyc')
  })
  it('blocks the result step until payment exists', () => {
    const beforePay = {
      kyc: true,
      personal: true,
      nominee: true,
      reviewConfirmed: true,
      payment: false,
    }
    expect(resolveAllowedStep('result', beforePay)).toBe('payment')
  })
})
