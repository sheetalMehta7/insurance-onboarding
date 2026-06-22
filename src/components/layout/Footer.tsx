import { useActivePartner } from '@/features/partners/useActivePartner'

export function Footer() {
  const partner = useActivePartner()
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {partner.name}. A demo onboarding experience — not a real product.
        </p>
        <p>Payments run in sandbox mode. No real money is charged.</p>
      </div>
    </footer>
  )
}
