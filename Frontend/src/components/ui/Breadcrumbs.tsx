'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const paths = pathname.split('/').filter(Boolean)
    const result: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/' }]

    paths.forEach((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/')
      const label = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      result.push({ label, href })
    })

    return result
  })()

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm', className)}
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-navy-400 hover:text-gold-400 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-navy-600" aria-hidden="true" />
            {isLast ? (
              <span className="text-white font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || '#'}
                className="text-navy-400 hover:text-gold-400 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

