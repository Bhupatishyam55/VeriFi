'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  debounceMs?: number
  className?: string
}

export function SearchBar({
  placeholder = 'Search documents, invoices, reports...',
  onSearch,
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  // Debounce search
  useEffect(() => {
    if (!onSearch) return

    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, onSearch])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        // Navigate to search results or trigger search
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    },
    [query, router]
  )

  const clearSearch = useCallback(() => {
    setQuery('')
    if (onSearch) {
      onSearch('')
    }
  }, [onSearch])

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div
        className={cn(
          'relative flex items-center transition-all duration-300',
          isFocused && 'ring-2 ring-gold-400/50'
        )}
      >
        <Search
          className="absolute left-4 w-5 h-5 text-navy-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-2.5 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30 focus:border-gold-400/50 transition-all duration-300"
          aria-label="Search"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 p-1 text-navy-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
}

