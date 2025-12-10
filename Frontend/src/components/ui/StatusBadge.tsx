'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'safe' | 'warning' | 'critical'
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  safe: {
    label: 'Safe',
    className: 'badge-safe',
  },
  warning: {
    label: 'Warning',
    className: 'badge-warning',
  },
  critical: {
    label: 'Critical',
    className: 'badge-critical',
  },
}

const sizeConfig = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span className={cn(config.className, sizeConfig[size])}>
      {config.label}
    </span>
  )
}

