import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return `₹${amount}`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num)
}

export function getStatusColor(status: 'safe' | 'warning' | 'critical'): string {
  const colors = {
    safe: 'text-success-400',
    warning: 'text-warning-400',
    critical: 'text-danger-400',
  }
  return colors[status]
}

export function getSeverityFromScore(score: number): 'SAFE' | 'WARNING' | 'CRITICAL' {
  if (score < 30) return 'SAFE'
  if (score < 70) return 'WARNING'
  return 'CRITICAL'
}

