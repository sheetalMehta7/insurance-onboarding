import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button } from './ui/Button'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

/** Catches render errors in the route tree and shows a recoverable fallback. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real app this would go to an error reporting service.
    console.error('Route error:', error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <span className="text-4xl" aria-hidden="true">💥</span>
          <h1 className="mt-4 text-xl font-bold text-fg">Something broke</h1>
          <p className="mt-2 text-sm text-fg-muted">
            An unexpected error occurred while rendering this page.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={this.reset}>Try again</Button>
            <Button variant="outline" onClick={() => (window.location.href = '/')}>
              Go home
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
