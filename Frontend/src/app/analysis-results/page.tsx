'use client'

// Force dynamic rendering to avoid prerender issues with search params
export const dynamic = 'force-dynamic'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { PDFViewer } from '@/features/results/PDFViewer'
import { AnalysisPanel } from '@/features/results/AnalysisPanel'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ExportButton } from '@/components/ui/ExportButton'
import { fetchScanResult, type ScanResult } from '@/lib/api'

export default function AnalysisResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="flex items-center gap-3 text-navy-300">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading analysis...</span>
          </div>
        </div>
      }
    >
      <AnalysisResultsContent />
    </Suspense>
  )
}

function AnalysisResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const taskId = searchParams.get('taskId')

  const [result, setResult] = useState<ScanResult | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(taskId))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
      if (!taskId) {
        setIsLoading(false)
        setError('Missing taskId. Please start a new scan.')
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchScanResult(taskId)
        if (isMounted) setResult(data)
      } catch (err) {
        if (isMounted) setError('Failed to load analysis. Please retry from uploads.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [taskId])

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-navy-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing your document...</span>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-navy-300">{error || 'Result not found.'}</p>
        <button onClick={() => router.push('/upload')} className="btn-primary">
          Go to Uploads
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Upload', href: '/upload' },
          { label: 'Analysis Results' },
        ]}
        className="mb-4"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-display font-bold text-white">Analysis Results</h1>
            <p className="text-xs md:text-sm text-navy-400">Document validation and fraud detection report</p>
          </div>
        </div>
        {result && (
          <ExportButton
            data={result}
            filename={`analysis-${result.file_id}`}
            variant="ghost"
          />
        )}
      </div>

      {/* Mobile: Stack layout, Desktop: Side-by-side */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Analysis Panel - Top on mobile, Right on desktop */}
        <div className="order-1 lg:order-2 lg:w-1/2 min-h-0">
          <div className="glass-card p-4 md:p-6 h-full">
            <AnalysisPanel result={result} onApprove={() => router.push('/')} onReject={() => router.push('/')} />
          </div>
        </div>

        {/* PDF Viewer - Bottom on mobile, Left on desktop */}
        <div className="order-2 lg:order-1 lg:w-1/2 min-h-0">
          <div className="h-[400px] md:h-[500px] lg:h-full overflow-hidden">
            <PDFViewer filename={result.filename} />
          </div>
        </div>
      </div>
    </div>
  )
}


