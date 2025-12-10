'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animate?: boolean
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animate = true,
}: SkeletonProps) {
  const baseStyles = 'bg-navy-800/50 rounded'
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animate && 'animate-pulse',
        className
      )}
      style={{
        width: width || undefined,
        height: height || undefined,
      }}
    />
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="rectangular" width={48} height={48} className="rounded-xl" />
        <Skeleton variant="rectangular" width={60} height={24} className="rounded-lg" />
      </div>
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="80%" height={32} />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <Skeleton variant="text" width="40%" height={24} className="mb-2" />
          <Skeleton variant="text" width="60%" height={16} />
        </div>
        <div className="flex gap-4">
          <Skeleton variant="rectangular" width={80} height={20} />
          <Skeleton variant="rectangular" width={80} height={20} />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={300} />
    </div>
  )
}

export function TableRowSkeleton({ columns = 3 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === 0 ? '40%' : '20%'}
          height={20}
        />
      ))}
    </div>
  )
}

