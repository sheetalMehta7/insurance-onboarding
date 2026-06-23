/** Formatting helpers. The catalog is priced in INR (Indian insurance context). */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const inrCompact = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** ₹12,000 */
export const formatCurrency = (amount: number): string => inr.format(amount)

/** ₹1.5Cr / ₹50L — compact, for large cover amounts on cards. */
export const formatCompactCurrency = (amount: number): string =>
  inrCompact.format(amount)

/** "5 years" / "1 year" */
export const formatYears = (years: number): string =>
  `${years} ${years === 1 ? 'year' : 'years'}`

export const formatDate = (iso: string): string => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
