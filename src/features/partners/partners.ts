import type { Partner } from '@/types'

/**
 * Partner registry.
 *
 * The whole multi-partner model hangs off this list: branding, the partner
 * switcher, and the plan catalog (plans reference partner ids) all read from
 * here. Adding a new partner is a single entry — no other code changes — which
 * is the "adding more partners later should be straightforward" requirement.
 */
export const partners: Partner[] = [
  {
    id: 'aegis',
    name: 'Aegis Insurance',
    shortName: 'Aegis',
    tagline: 'Protection that endures.',
    brand: '#2563eb',
    brandStrong: '#1d4ed8',
    brandContrast: '#ffffff',
  },
  {
    id: 'verdant',
    name: 'Verdant Assure',
    shortName: 'Verdant',
    tagline: 'Insurance that grows with you.',
    brand: '#0d9488',
    brandStrong: '#0f766e',
    brandContrast: '#ffffff',
  },
  {
    id: 'solaris',
    name: 'Solaris Cover',
    shortName: 'Solaris',
    tagline: 'Cover, simplified.',
    brand: '#ea580c',
    brandStrong: '#c2410c',
    brandContrast: '#ffffff',
  },
  {
    id: 'nimbus',
    name: 'Nimbus Shield',
    shortName: 'Nimbus',
    tagline: 'Modern cover for modern life.',
    brand: '#7c3aed',
    brandStrong: '#6d28d9',
    brandContrast: '#ffffff',
  },
]

export const DEFAULT_PARTNER_ID = partners[0].id

export const partnerIds = partners.map((p) => p.id)

export function getPartner(id: string | null | undefined): Partner | undefined {
  return partners.find((p) => p.id === id)
}

/** Resolve to a valid partner, falling back to the default for unknown ids. */
export function resolvePartner(id: string | null | undefined): Partner {
  return getPartner(id) ?? partners[0]
}
