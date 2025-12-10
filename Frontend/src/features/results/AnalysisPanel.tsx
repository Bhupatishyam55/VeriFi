'use client'

import React from 'react'
import {
  AlertTriangle,
  FileWarning,
  Copy,
  Check,
  X,
  ExternalLink,
  Clock,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FraudGauge } from '@/components/ui/FraudGauge'
import type { ScanResult, Anomaly } from '@/lib/mock-api'

interface AnalysisPanelProps {
  result: ScanResult
  onApprove: () => void
  onReject: () => void
}

function AnomalyCard({ anomaly, index }: { anomaly: Anomaly; index: number }) {
  return (
    <div
      className="p-4 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-danger-500/30 transition-colors"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-danger-500/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-danger-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-white">{anomaly.type}</h4>
            <span className="text-sm font-medium text-danger-400">
              {Math.round(anomaly.confidence * 100)}% confidence
            </span>
          </div>
          <p className="text-sm text-navy-400 mt-1">{anomaly.description}</p>
        </div>
      </div>
    </div>
  )
}

export function AnalysisPanel({ result, onApprove, onReject }: AnalysisPanelProps) {
  const [copied, setCopied] = React.useState(false)

  const copyFileId = () => {
    navigator.clipboard.writeText(result.file_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-navy-400 text-sm mb-2">
          <Clock className="w-4 h-4" />
          <span>
            Scanned {new Date(result.scanned_at).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
        <h2 className="text-2xl font-display font-bold text-white">{result.filename}</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-navy-500">ID: {result.file_id.slice(0, 8)}...</span>
          <button
            onClick={copyFileId}
            className="p-1 hover:bg-navy-700 rounded transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success-400" />
            ) : (
              <Copy className="w-4 h-4 text-navy-400" />
            )}
          </button>
        </div>
      </div>

      {/* Fraud Gauge */}
      <div className="glass-card p-6 flex justify-center">
        <FraudGauge score={result.fraud_score} size="lg" />
      </div>

      {/* Severity Badge */}
      <div
        className={cn(
          'p-4 rounded-xl border text-center',
          result.severity === 'CRITICAL' && 'bg-danger-500/10 border-danger-500/30',
          result.severity === 'WARNING' && 'bg-warning-500/10 border-warning-500/30',
          result.severity === 'SAFE' && 'bg-success-500/10 border-success-500/30'
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <Shield
            className={cn(
              'w-5 h-5',
              result.severity === 'CRITICAL' && 'text-danger-400',
              result.severity === 'WARNING' && 'text-warning-400',
              result.severity === 'SAFE' && 'text-success-400'
            )}
          />
          <span
            className={cn(
              'font-bold text-lg',
              result.severity === 'CRITICAL' && 'text-danger-400',
              result.severity === 'WARNING' && 'text-warning-400',
              result.severity === 'SAFE' && 'text-success-400'
            )}
          >
            {result.severity} RISK
          </span>
        </div>
      </div>

      {/* Duplicate Warning */}
      {result.is_duplicate && (
        <div className="p-4 bg-danger-500/10 border border-danger-500/30 rounded-xl animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger-500/20 flex items-center justify-center flex-shrink-0">
              <FileWarning className="w-5 h-5 text-danger-400" />
            </div>
            <div>
              <h4 className="font-bold text-danger-400">⚠️ Duplicate Document Detected</h4>
              <p className="text-sm text-navy-300 mt-1">
                This document appears to be a duplicate of an existing record in the database.
              </p>
              <div className="mt-3 p-3 bg-navy-800/50 rounded-lg">
                <p className="text-xs text-navy-400">Original Document Reference:</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm text-gold-400 font-mono">
                    {result.duplicate_source_id}
                  </code>
                  <button className="text-gold-400 hover:text-gold-300 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anomalies List */}
      <div>
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-danger-400" />
          Detected Anomalies ({result.anomalies.length})
        </h3>

        {result.anomalies.length > 0 ? (
          <div className="space-y-3">
            {result.anomalies.map((anomaly, index) => (
              <AnomalyCard key={index} anomaly={anomaly} index={index} />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-success-500/5 border border-success-500/20 rounded-xl text-center">
            <Check className="w-10 h-10 text-success-400 mx-auto mb-2" />
            <p className="text-success-400 font-medium">No Anomalies Detected</p>
            <p className="text-sm text-navy-400 mt-1">
              This document passed all validation checks
            </p>
          </div>
        )}
      </div>

      {/* Processing Info */}
      <div className="glass-card p-4">
        <h4 className="font-medium text-white mb-3">Processing Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-navy-400">Processing Time</span>
            <span className="text-white">{(result.processing_time / 1000).toFixed(2)}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-400">Database Compared</span>
            <span className="text-white">70 TB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-400">AI Model Version</span>
            <span className="text-white">v2.4.1</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-navy-700">
        <button
          onClick={onApprove}
          className="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
        >
          <Check className="w-5 h-5" />
          Approve Document
        </button>
        <button
          onClick={onReject}
          className="flex-1 btn-danger flex items-center justify-center gap-2 py-4"
        >
          <X className="w-5 h-5" />
          Reject & Flag
        </button>
      </div>
    </div>
  )
}

