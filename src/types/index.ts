/** Types used across the insurance onboarding app. */

/* ----------------------------- Partners ------------------------------ */

export interface PartnerBrand {
  /** Primary brand color (buttons, links, accents). */
  brand: string
  /** Darker shade for hover/active and gradients. */
  brandStrong: string
  /** Readable text color placed on top of the brand color. */
  brandContrast: string
}

export interface Partner extends PartnerBrand {
  id: string
  name: string
  shortName: string
  tagline: string
}

/* ------------------------------- Plans ------------------------------- */

export type PlanCategory =
  | 'Term Life'
  | 'Health'
  | 'Motor'
  | 'Travel'
  | 'Home'

export interface CoverageRange {
  /** Cover amount bounds in INR. */
  min: number
  max: number
  step: number
  default: number
}

export interface Plan {
  id: string
  name: string
  category: PlanCategory
  tagline: string
  description: string
  /** Shown in the featured carousel when true. */
  featured: boolean
  /** Which partners offer this plan; catalog is filtered by active partner. */
  partnerIds: string[]
  /** Emoji used as a lightweight, dependency-free plan icon. */
  icon: string
  coverage: CoverageRange
  /** Selectable policy terms, in years. */
  termOptions: number[]
  /** Annual premium per ₹1 lakh of cover, before term factor & tax. */
  baseRatePerLakh: number
  /** Headline selling points. */
  benefits: string[]
  /** "What's covered" rows on the detail page. */
  coverageDetails: { label: string; value: string }[]
  exclusions: string[]
  /** Marketing/trust signals. */
  rating: number
  claimSettlementRatio: number
}

/* ------------------------------ Quotes ------------------------------- */

export interface QuoteInput {
  coverAmount: number
  termYears: number
}

export interface Quote {
  coverAmount: number
  termYears: number
  /** Annual premium before tax. */
  basePremium: number
  /** GST applied on the base premium. */
  tax: number
  taxRate: number
  /** What the customer pays per year (base + tax). */
  annualPremium: number
}

/* --------------------------- Onboarding ------------------------------ */

export type OnboardingStepId =
  | 'kyc'
  | 'personal'
  | 'nominee'
  | 'review'
  | 'payment'
  | 'result'

export interface KycData {
  pan: string
  dateOfBirth: string
}

export type Gender = 'male' | 'female' | 'other'

export interface PersonalData {
  fullName: string
  email: string
  gender: Gender
  phone: string
  addressLine: string
  city: string
  state: string
  pincode: string
}

export type NomineeRelation =
  | 'spouse'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'other'

export interface NomineeData {
  fullName: string
  relation: NomineeRelation
  dateOfBirth: string
  /** Percentage share of the sum assured (1–100). */
  sharePercent: number
}

export type PaymentStatus = 'success' | 'failed'

export interface PaymentResult {
  status: PaymentStatus
  referenceId: string
  /** Epoch ms; stamped by the payment layer. */
  paidAt: number
  amount: number
  method?: string
}
