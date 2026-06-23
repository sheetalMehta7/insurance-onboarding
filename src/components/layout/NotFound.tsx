import { Link } from 'react-router-dom'
import { buttonStyles } from '@/components/ui/buttonStyles'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl font-bold text-brand">404</p>
      <h1 className="mt-3 text-xl font-bold text-fg">Page not found</h1>
      <p className="mt-2 text-sm text-fg-muted">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link to="/" className={`mt-6 ${buttonStyles({ variant: 'primary' })}`}>
        Back to plans
      </Link>
    </div>
  )
}
