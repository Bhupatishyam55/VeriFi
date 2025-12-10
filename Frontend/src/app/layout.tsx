import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'AP FraudShield | Document Validation & Fraud Detection',
  description: 'AI-powered document validation and fraud detection platform for the Finance Department, Government of Andhra Pradesh',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-navy-950 pattern-grid">
        <ErrorBoundary>
          <ToastProvider>
            <Sidebar />
            <Header />
            <main className="ml-72 pt-16 min-h-screen">
              <div className="p-6">
                {children}
              </div>
            </main>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

