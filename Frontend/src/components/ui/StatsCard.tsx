'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'gold' | 'danger' | 'success'
}

const variants = {
  default: {
    icon: 'bg-navy-700 text-navy-300',
    glow: '',
  },
  gold: {
    icon: 'bg-gold-400/20 text-gold-400',
    glow: 'hover:shadow-glow-gold',
  },
  danger: {
    icon: 'bg-danger-500/20 text-danger-400',
    glow: 'hover:shadow-glow-danger',
  },
  success: {
    icon: 'bg-success-500/20 text-success-400',
    glow: '',
  },
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: StatsCardProps) {
  const style = variants[variant]

  return (
    <div
      className={cn(
        'stat-card group transition-all duration-300 hover:border-navy-600',
        style.glow
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-400/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-xl', style.icon)}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg',
                trend.isPositive
                  ? 'text-success-400 bg-success-500/10'
                  : 'text-danger-400 bg-danger-500/10'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <p className="text-navy-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-display font-bold text-white">{value}</p>
        {subtitle && (
          <p className="text-navy-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

