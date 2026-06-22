import { z } from 'zod'

/** Years between an ISO date and now. */
function ageFrom(iso: string): number {
  const dob = new Date(iso)
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const m = now.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--
  return age
}

/** Indian PAN: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F). */
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/
/** Indian mobile: 10 digits starting 6–9. */
export const PHONE_REGEX = /^[6-9]\d{9}$/

export const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE_REGEX, 'Enter a valid 10-digit mobile number')

export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Enter the 6-digit code')

export const kycSchema = z.object({
  pan: z
    .string()
    .trim()
    .toUpperCase()
    .regex(PAN_REGEX, 'Enter a valid PAN (e.g. ABCDE1234F)'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((v) => !Number.isNaN(new Date(v).getTime()), 'Invalid date')
    .refine((v) => new Date(v) < new Date(), 'Date cannot be in the future')
    .refine((v) => ageFrom(v) >= 18, 'Applicant must be at least 18')
    .refine((v) => ageFrom(v) <= 100, 'Please check the date of birth'),
})

export const personalSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter your full name')
    .max(60, 'Name is too long'),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  gender: z.enum(['male', 'female', 'other']),
  phone: phoneSchema,
  addressLine: z.string().trim().min(5, 'Enter your address'),
  city: z.string().trim().min(2, 'Enter your city'),
  state: z.string().trim().min(2, 'Enter your state'),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
})

export const nomineeSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the nominee's name"),
  relation: z.enum(['spouse', 'child', 'parent', 'sibling', 'other']),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((v) => !Number.isNaN(new Date(v).getTime()), 'Invalid date')
    .refine((v) => new Date(v) < new Date(), 'Date cannot be in the future'),
  sharePercent: z.coerce
    .number()
    .int('Use a whole number')
    .min(1, 'Share must be at least 1%')
    .max(100, 'Share cannot exceed 100%'),
})

export type KycForm = z.infer<typeof kycSchema>
export type PersonalForm = z.infer<typeof personalSchema>
export type NomineeForm = z.infer<typeof nomineeSchema>
