import { describe, it, expect } from 'vitest'
import { computeQuote, clampCover, clampTerm, defaultQuote } from './quote'
import type { Plan } from '@/types'

const plan: Plan = {
  id: 'test',
  name: 'Test Plan',
  category: 'Term Life',
  tagline: '',
  description: '',
  featured: false,
  partnerIds: ['aegis'],
  icon: '🛡️',
  coverage: { min: 2_500_000, max: 50_000_000, step: 2_500_000, default: 10_000_000 },
  termOptions: [10, 20, 30],
  baseRatePerLakh: 22,
  benefits: [],
  coverageDetails: [],
  exclusions: [],
  rating: 4.5,
  claimSettlementRatio: 98,
}

describe('clampCover', () => {
  it('clamps below the minimum up to min', () => {
    expect(clampCover(plan, 1_000)).toBe(2_500_000)
  })
  it('clamps above the maximum down to max', () => {
    expect(clampCover(plan, 99_000_000)).toBe(50_000_000)
  })
  it('snaps to the nearest step', () => {
    // 4,000,000 is between 2.5M and 5M → snaps to 5M (nearest step).
    expect(clampCover(plan, 4_000_000)).toBe(5_000_000)
  })
})

describe('clampTerm', () => {
  it('keeps an allowed term', () => {
    expect(clampTerm(plan, 20)).toBe(20)
  })
  it('snaps to the nearest allowed term', () => {
    expect(clampTerm(plan, 13)).toBe(10)
    expect(clampTerm(plan, 26)).toBe(30)
  })
})

describe('computeQuote', () => {
  it('computes a deterministic premium with GST', () => {
    const q = computeQuote(plan, { coverAmount: 10_000_000, termYears: 10 })
    // 100 lakhs * 22 * termFactor(1.0) = 2200 base; GST 18% = 396.
    expect(q.basePremium).toBe(2200)
    expect(q.tax).toBe(396)
    expect(q.annualPremium).toBe(2596)
  })
  it('applies a higher loading for longer terms', () => {
    const short = computeQuote(plan, { coverAmount: 10_000_000, termYears: 10 })
    const long = computeQuote(plan, { coverAmount: 10_000_000, termYears: 30 })
    expect(long.basePremium).toBeGreaterThan(short.basePremium)
  })
  it('clamps out-of-range inputs before pricing', () => {
    const q = computeQuote(plan, { coverAmount: 999_999_999, termYears: 5 })
    expect(q.coverAmount).toBe(50_000_000)
    expect(q.termYears).toBe(10)
  })
})

describe('defaultQuote', () => {
  it('uses the plan default cover and a mid term', () => {
    const q = defaultQuote(plan)
    expect(q.coverAmount).toBe(10_000_000)
    expect(plan.termOptions).toContain(q.termYears)
  })
})
