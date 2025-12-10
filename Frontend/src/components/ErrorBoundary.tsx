'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })

    // Log to error tracking service (e.g., Sentry)
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
    }

    return this.props.children
  }
}

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error | null
  onReset: () => void
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 p-6">
      <div className="max-w-2xl w-full glass-card p-8 border border-danger-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-danger-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-danger-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-navy-400 mb-4">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {error && (
              <div className="p-4 bg-navy-800/50 rounded-lg border border-navy-700 mb-4">
                <p className="text-sm font-mono text-danger-400 mb-1">
                  {error.name}: {error.message}
                </p>
                {process.env.NODE_ENV === 'development' && error.stack && (
                  <pre className="text-xs text-navy-500 mt-2 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={onReset}
                className="btn-primary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="btn-ghost flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

