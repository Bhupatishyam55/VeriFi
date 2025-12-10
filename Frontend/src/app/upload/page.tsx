'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Clock, CheckCircle2, AlertTriangle, FileText, HelpCircle } from 'lucide-react'
import { DropZone } from '@/features/upload/DropZone'
import { ScanningModal } from '@/features/upload/ScanningModal'
import { uploadDocument } from '@/lib/api'
import { uploadFile } from '@/lib/api-client'
import { useToast } from '@/components/providers/ToastProvider'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function UploadPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileSelect = async (file: File) => {
    setCurrentFile(file)
    setIsUploading(true)
    setUploadProgress(0)
    setIsScanning(false) // Don't show scanning modal until upload is done

    try {
      // Step 1: Upload file with progress tracking
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1'
      
      let finalProgress = 0
      const response = await uploadFile(
        `${API_BASE}/scan/upload`,
        file,
        (progress) => {
          finalProgress = progress
          setUploadProgress(progress)
        }
      )

      // Ensure we show 100% even if upload completes very fast
      if (finalProgress < 100) {
        setUploadProgress(100)
      }
      
      // Small delay to show 100% completion
      await new Promise((resolve) => setTimeout(resolve, 500))

      const uploadRes = await response.json()
      setScanResult(uploadRes.task_id)
      
      // Step 2: Upload complete, now show scanning modal
      setIsUploading(false)
      setIsScanning(true)
      
      // The scanning modal will handle the completion and redirect
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'An error occurred while uploading the document. Please try again.',
      })
      setCurrentFile(null)
      setUploadProgress(0)
      setIsUploading(false)
      setIsScanning(false)
    }
  }

  const handleScanComplete = () => {
    setIsScanning(false)
    if (scanResult) {
      // Small delay before redirect to show completion
      setTimeout(() => {
        router.push(`/analysis-results?taskId=${scanResult}`)
      }, 500)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Smart Upload' }]} />

      {/* Upload Progress */}
      {(isUploading || (uploadProgress === 100 && !isScanning)) && (
        <div className="glass-card p-4 animate-fade-in border border-success-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-navy-400 flex items-center gap-2">
              {uploadProgress < 100 ? (
                <>
                  <span className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
                  Uploading file...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success-400" />
                  <span className="text-success-400">Upload complete!</span>
                </>
              )}
            </span>
            <span className="text-sm font-medium text-success-400">{Math.round(uploadProgress)}%</span>
          </div>
          <ProgressBar progress={uploadProgress} variant="success" size="md" />
          {uploadProgress === 100 && !isScanning && (
            <p className="text-xs text-success-400 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
              Preparing document for analysis...
            </p>
          )}
        </div>
      )}

      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 mb-4">
          <Shield className="w-8 h-8 text-gold-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white">Smart Document Upload</h1>
        <p className="text-navy-400 mt-2 max-w-lg mx-auto">
          Upload invoices, contracts, or any financial documents for AI-powered fraud detection
          and validation against our 70TB database.
        </p>
      </div>

      {/* Upload Zone */}
      <DropZone onFileSelect={handleFileSelect} disabled={isScanning || isUploading} />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gold-400/10 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-gold-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Fast Processing</h3>
          <p className="text-sm text-navy-400">
            Documents are analyzed in under 5 seconds using our AI engine
          </p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-success-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-success-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">99.7% Accuracy</h3>
          <p className="text-sm text-navy-400">
            Our models are trained on millions of verified documents
          </p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-danger-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-danger-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Fraud Detection</h3>
          <p className="text-sm text-navy-400">
            Detects duplicates, forgeries, and metadata anomalies
          </p>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Uploads</h3>
          <button className="text-sm text-gold-400 hover:text-gold-300 font-medium transition-colors">
            View History
          </button>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Invoice_Treasury_2024_5521.pdf', status: 'critical', time: '5 min ago', score: 92 },
            { name: 'Contract_PWD_Tender_1102.pdf', status: 'warning', time: '23 min ago', score: 58 },
            { name: 'Receipt_Health_Services_8834.pdf', status: 'safe', time: '1 hour ago', score: 12 },
            { name: 'Bill_Education_Board_2210.pdf', status: 'safe', time: '2 hours ago', score: 8 },
          ].map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-navy-800/30 rounded-xl hover:bg-navy-800/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/results/demo`)}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  file.status === 'safe'
                    ? 'bg-success-500/10'
                    : file.status === 'warning'
                    ? 'bg-warning-500/10'
                    : 'bg-danger-500/10'
                }`}
              >
                <FileText
                  className={`w-5 h-5 ${
                    file.status === 'safe'
                      ? 'text-success-400'
                      : file.status === 'warning'
                      ? 'text-warning-400'
                      : 'text-danger-400'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-navy-500">{file.time}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    file.status === 'safe'
                      ? 'text-success-400'
                      : file.status === 'warning'
                      ? 'text-warning-400'
                      : 'text-danger-400'
                  }`}
                >
                  {file.score}%
                </p>
                <p className="text-xs text-navy-500">Risk</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="glass-card p-6 border border-gold-400/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-sm text-navy-400 mb-3">
              Our system accepts various document formats including PDF, DOC, DOCX, XLS, XLSX, and image files.
              Each document is encrypted during transmission and processed in a secure environment.
            </p>
            <button className="text-sm text-gold-400 hover:text-gold-300 font-medium transition-colors">
              Read Documentation →
            </button>
          </div>
        </div>
      </div>

      {/* Scanning Modal */}
      <ScanningModal
        isOpen={isScanning}
        filename={currentFile?.name || ''}
        onComplete={handleScanComplete}
      />
    </div>
  )
}

