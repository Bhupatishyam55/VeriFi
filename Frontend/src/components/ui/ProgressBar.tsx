'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  variant?: 'default' | 'gold' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

const variants = {
  default: 'from-navy-400 to-navy-500',
  gold: 'from-gold-400 to-gold-500',
  danger: 'from-danger-400 to-danger-500',
  success: 'from-success-400 to-success-500',
}

const sizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  progress,
  variant = 'gold',
  size = 'md',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-navy-400">Progress</span>
          <span className="text-white font-medium">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-navy-700 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out',
            variants[variant],
            animated && 'relative overflow-hidden'
          )}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          )}
        </div>
      </div>
    </div>
  )
}

