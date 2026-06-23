import { describe, it, expect } from 'vitest'
import { kycSchema, personalSchema, nomineeSchema, phoneSchema } from './schemas'

const eighteenYearsAgo = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 25)
  return d.toISOString().slice(0, 10)
}

describe('kycSchema', () => {
  it('accepts a valid PAN and adult DOB', () => {
    const r = kycSchema.safeParse({ pan: 'ABCDE1234F', dateOfBirth: eighteenYearsAgo() })
    expect(r.success).toBe(true)
  })
  it('uppercases the PAN', () => {
    const r = kycSchema.safeParse({ pan: 'abcde1234f', dateOfBirth: eighteenYearsAgo() })
    expect(r.success && r.data.pan).toBe('ABCDE1234F')
  })
  it('rejects a malformed PAN', () => {
    expect(kycSchema.safeParse({ pan: '12345', dateOfBirth: eighteenYearsAgo() }).success).toBe(false)
  })
  it('rejects an under-18 applicant', () => {
    const recent = new Date()
    recent.setFullYear(recent.getFullYear() - 10)
    const r = kycSchema.safeParse({ pan: 'ABCDE1234F', dateOfBirth: recent.toISOString().slice(0, 10) })
    expect(r.success).toBe(false)
  })
})

describe('phoneSchema', () => {
  it('accepts a valid 10-digit Indian mobile', () => {
    expect(phoneSchema.safeParse('9876543210').success).toBe(true)
  })
  it('rejects numbers that are too short or start with 0–5', () => {
    expect(phoneSchema.safeParse('12345').success).toBe(false)
    expect(phoneSchema.safeParse('1234567890').success).toBe(false)
  })
})

describe('personalSchema', () => {
  const valid = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    gender: 'female' as const,
    phone: '9876543210',
    addressLine: '12 Main Street',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
  }
  it('accepts valid details', () => {
    expect(personalSchema.safeParse(valid).success).toBe(true)
  })
  it('rejects a bad email and pincode', () => {
    expect(personalSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false)
    expect(personalSchema.safeParse({ ...valid, pincode: '12' }).success).toBe(false)
  })
})

describe('nomineeSchema', () => {
  const valid = {
    fullName: 'John Doe',
    relation: 'spouse' as const,
    dateOfBirth: '1990-01-01',
    sharePercent: 100,
  }
  it('accepts a valid nominee', () => {
    expect(nomineeSchema.safeParse(valid).success).toBe(true)
  })
  it('rejects share outside 1–100', () => {
    expect(nomineeSchema.safeParse({ ...valid, sharePercent: 0 }).success).toBe(false)
    expect(nomineeSchema.safeParse({ ...valid, sharePercent: 150 }).success).toBe(false)
  })
})
