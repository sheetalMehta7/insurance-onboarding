import { useState } from 'react'
import { partners } from './partners'
import { usePartnerStore } from './partnerStore'
import { useActivePartner } from './useActivePartner'
import { PartnerLogo } from './PartnerLogo'
import { useClickOutside } from '@/lib/hooks'
import { cn } from '@/lib/cn'

/**
 * Runtime partner selector. Switching updates the persisted active partner,
 * which cascades through BrandingProvider to rebrand the whole app.
 */
export function PartnerSwitcher() {
  const [open, setOpen] = useState(false)
  const active = useActivePartner()
  const setPartner = usePartnerStore((s) => s.setPartner)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

  return (
    <div className="relative" ref={ref} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Active partner: ${active.name}. Change partner`}
      >
        <span
          className="size-4 rounded-full"
          style={{ backgroundColor: active.brand }}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{active.shortName}</span>
        <svg viewBox="0 0 20 20" className="size-4 text-fg-muted" aria-hidden="true">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Choose partner"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-surface shadow-xl shadow-black/10"
        >
          {partners.map((p) => {
            const selected = p.id === active.id
            return (
              <li key={p.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    setPartner(p.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-2',
                    selected && 'bg-brand-soft',
                  )}
                >
                  <PartnerLogo partner={p} markOnly />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-fg">
                      {p.name}
                    </span>
                    <span className="block truncate text-xs text-fg-muted">
                      {p.tagline}
                    </span>
                  </span>
                  {selected && (
                    <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-brand" aria-hidden="true">
                      <path d="M5 10l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
