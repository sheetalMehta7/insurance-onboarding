import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useActivePartner } from './useActivePartner'

/**
 * Applies the active partner's brand to the document by setting the three
 * brand CSS variables on <html>. Every brand-aware utility (bg-brand,
 * text-brand, border-brand…) reads these, so the entire UI rebrands by
 * mutating three custom properties — no re-render of consumers required.
 *
 * Also keeps the document title and the browser theme-color in sync.
 */
export function BrandingProvider({ children }: { children: ReactNode }) {
  const partner = useActivePartner()

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--brand', partner.brand)
    root.style.setProperty('--brand-strong', partner.brandStrong)
    root.style.setProperty('--brand-contrast', partner.brandContrast)
    root.dataset.partner = partner.id

    document.title = `${partner.name} — Insurance Onboarding`

    const themeMeta = document.querySelector('meta[name="theme-color"]')
    themeMeta?.setAttribute('content', partner.brand)
  }, [partner])

  return children
}
