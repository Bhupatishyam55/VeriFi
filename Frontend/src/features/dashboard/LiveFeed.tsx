'use client'

import React, { useEffect, useState } from 'react'
import { FileText, Clock, ArrowRight } from 'lucide-react'
import { getRecentFiles, type RecentFile } from '@/lib/mock-api'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${Math.floor(diffHours / 24)} day${diffHours >= 48 ? 's' : ''} ago`
}

export function LiveFeed() {
  const [files, setFiles] = useState<RecentFile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const recentFiles = await getRecentFiles()
      setFiles(recentFiles)
      setIsLoading(false)
    }
    fetchData()

    // Simulate live updates every 30 seconds
    const interval = setInterval(async () => {
      const newFiles = await getRecentFiles()
      setFiles(newFiles)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="glass-card p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Live Activity Feed</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-navy-800/30 rounded-xl">
              <div className="w-10 h-10 bg-navy-700 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-navy-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-navy-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Live Activity Feed</h3>
          <div className="flex items-center gap-2 px-2 py-1 bg-success-500/10 rounded-full">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
            <span className="text-xs text-success-400 font-medium">Live</span>
          </div>
        </div>
        <Link
          href="/upload"
          className="text-sm text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {files.map((file, index) => (
          <Link
            key={file.id}
            href={`/results/${file.id}`}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl transition-all duration-300',
              'bg-navy-800/30 hover:bg-navy-800/50 border border-transparent hover:border-navy-700',
              'cursor-pointer group'
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                file.status === 'safe' && 'bg-success-500/10',
                file.status === 'warning' && 'bg-warning-500/10',
                file.status === 'critical' && 'bg-danger-500/10'
              )}
            >
              <FileText
                className={cn(
                  'w-5 h-5',
                  file.status === 'safe' && 'text-success-400',
                  file.status === 'warning' && 'text-warning-400',
                  file.status === 'critical' && 'text-danger-400'
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate group-hover:text-gold-400 transition-colors">
                  {file.filename}
                </p>
                <StatusBadge status={file.status} size="sm" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-navy-400 truncate">{file.department}</p>
                <span className="text-navy-600">•</span>
                <div className="flex items-center gap-1 text-xs text-navy-500">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(file.scanned_at)}
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p
                className={cn(
                  'text-lg font-bold',
                  file.status === 'safe' && 'text-success-400',
                  file.status === 'warning' && 'text-warning-400',
                  file.status === 'critical' && 'text-danger-400'
                )}
              >
                {file.fraud_score}%
              </p>
              <p className="text-xs text-navy-500">Risk Score</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

