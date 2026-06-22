import type { Partner } from '@/types'
import { useActivePartner } from './useActivePartner'
import { cn } from '@/lib/cn'

/** Per-partner SVG mark. Uses currentColor so it inherits the brand color. */
const marks: Record<string, React.ReactNode> = {
  aegis: (
    <path
      d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z"
      fill="currentColor"
    />
  ),
  verdant: (
    <path
      d="M12 21c6-1 9-5 9-12V4c-7 0-13 3-13 10 0 1.4.3 2.7.8 3.8L6 21h2l2-3c.6.1 1.3.2 2 .2Z"
      fill="currentColor"
    />
  ),
  solaris: (
    <>
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
      </g>
    </>
  ),
  nimbus: (
    <path
      d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5-1.5A3.75 3.75 0 0 1 17 18H7Z"
      fill="currentColor"
    />
  ),
}

interface PartnerLogoProps {
  partner?: Partner
  /** Hide the wordmark, showing only the mark (e.g. compact mobile header). */
  markOnly?: boolean
  className?: string
}

export function PartnerLogo({
  partner,
  markOnly = false,
  className,
}: PartnerLogoProps) {
  const active = useActivePartner()
  const p = partner ?? active

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          aria-hidden="true"
          fill="none"
        >
          {marks[p.id] ?? marks.aegis}
        </svg>
      </span>
      {!markOnly && (
        <span className="text-lg font-bold tracking-tight text-fg">
          {p.shortName}
        </span>
      )}
    </span>
  )
}
