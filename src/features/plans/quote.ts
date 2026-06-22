import type { Plan, Quote, QuoteInput } from '@/types'

export const TAX_RATE = 0.18 // GST on insurance premium

/** Snap a cover amount to the plan's allowed range and step. */
export function clampCover(plan: Plan, value: number): number {
  const { min, max, step } = plan.coverage
  const clamped = Math.min(max, Math.max(min, value))
  const snapped = Math.round((clamped - min) / step) * step + min
  return Math.min(max, Math.max(min, snapped))
}

/** Snap a term to the nearest allowed option. */
export function clampTerm(plan: Plan, years: number): number {
  if (plan.termOptions.includes(years)) return years
  return plan.termOptions.reduce((best, opt) =>
    Math.abs(opt - years) < Math.abs(best - years) ? opt : best,
  )
}

/**
 * Deterministic premium calculation.
 *
 * annualBase = (cover in lakhs) × baseRatePerLakh × termFactor
 * Longer terms carry a small loading (more years of risk), then GST is added.
 * Kept pure and deterministic so the quote shown on the detail page matches
 * the review and payment screens exactly.
 */
export function computeQuote(plan: Plan, input: QuoteInput): Quote {
  const coverAmount = clampCover(plan, input.coverAmount)
  const termYears = clampTerm(plan, input.termYears)

  const shortestTerm = Math.min(...plan.termOptions)
  const termFactor = 1 + (termYears - shortestTerm) * 0.02

  const basePremium = Math.round(
    (coverAmount / 100_000) * plan.baseRatePerLakh * termFactor,
  )
  const tax = Math.round(basePremium * TAX_RATE)

  return {
    coverAmount,
    termYears,
    basePremium,
    tax,
    taxRate: TAX_RATE,
    annualPremium: basePremium + tax,
  }
}

/** Quote for a plan's default configuration — used on cards. */
export function defaultQuote(plan: Plan): Quote {
  return computeQuote(plan, {
    coverAmount: plan.coverage.default,
    termYears: plan.termOptions[Math.floor(plan.termOptions.length / 2)],
  })
}
