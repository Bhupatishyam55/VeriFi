'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Share2, Download, Printer } from 'lucide-react'
import { PDFViewer } from '@/features/results/PDFViewer'
import { AnalysisPanel } from '@/features/results/AnalysisPanel'
import { getScanResult, type ScanResult } from '@/lib/mock-api'
import { useToast } from '@/components/providers/ToastProvider'

export default function ResultsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { addToast } = useToast()
  const [result, setResult] = useState<ScanResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch the scan result
    const data = getScanResult(id)
    setResult(data)
    setIsLoading(false)
  }, [id])

  const handleApprove = () => {
    addToast({
      type: 'success',
      title: 'Document Approved',
      message: `${result?.filename} has been approved and marked as verified.`,
    })
    router.push('/')
  }

  const handleReject = () => {
    addToast({
      type: 'warning',
      title: 'Document Flagged',
      message: `${result?.filename} has been rejected and flagged for investigation.`,
    })
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-navy-400">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Result Not Found</h2>
          <p className="text-navy-400 mb-4">The requested scan result could not be found.</p>
          <button onClick={() => router.push('/')} className="btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-white">Analysis Results</h1>
            <p className="text-sm text-navy-400">Document validation and fraud detection report</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors">
            <Printer className="w-5 h-5" />
          </button>
          <button className="btn-ghost flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left: PDF Viewer */}
        <div className="min-h-0">
          <PDFViewer filename={result.filename} />
        </div>

        {/* Right: Analysis Panel */}
        <div className="min-h-0 glass-card p-6">
          <AnalysisPanel result={result} onApprove={handleApprove} onReject={handleReject} />
        </div>
      </div>
    </div>
  )
}

