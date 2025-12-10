'use client'

import React, { useState } from 'react'
import { Filter, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FilterOption = {
  id: string
  label: string
  value: string | number
}

export type FilterGroup = {
  id: string
  label: string
  options: FilterOption[]
  type?: 'single' | 'multiple'
}

interface FilterPanelProps {
  filters: FilterGroup[]
  onFilterChange?: (filters: Record<string, string[]>) => void
  className?: string
}

export function FilterPanel({ filters, onFilterChange, className }: FilterPanelProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterToggle = (groupId: string, value: string, type: 'single' | 'multiple' = 'multiple') => {
    setSelectedFilters((prev) => {
      const current = prev[groupId] || []
      let newValues: string[]

      if (type === 'single') {
        newValues = current.includes(value) ? [] : [value]
      } else {
        newValues = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]
      }

      const updated = {
        ...prev,
        [groupId]: newValues.length > 0 ? newValues : undefined,
      }

      // Remove empty filter groups
      Object.keys(updated).forEach((key) => {
        if (!updated[key] || updated[key].length === 0) {
          delete updated[key]
        }
      })

      if (onFilterChange) {
        onFilterChange(updated)
      }

      return updated
    })
  }

  const clearFilters = () => {
    setSelectedFilters({})
    if (onFilterChange) {
      onFilterChange({})
    }
  }

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (sum, values) => sum + (values?.length || 0),
    0
  )

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-navy-800/50 border border-navy-700 rounded-xl text-navy-300 hover:text-white hover:border-gold-400/30 transition-all duration-300"
        aria-label="Toggle filters"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 bg-gold-400 text-navy-900 text-xs font-bold rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 w-80 glass-card border border-navy-700 rounded-2xl shadow-2xl z-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Filter Options</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-navy-400 hover:text-white transition-colors"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              {filters.map((group) => (
                <div key={group.id}>
                  <h4 className="text-sm font-medium text-navy-300 mb-3">{group.label}</h4>
                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isSelected = selectedFilters[group.id]?.includes(String(option.value))
                      return (
                        <button
                          key={option.id}
                          onClick={() =>
                            handleFilterToggle(group.id, String(option.value), group.type)
                          }
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left',
                            isSelected
                              ? 'bg-gold-400/10 border border-gold-400/30 text-gold-400'
                              : 'bg-navy-800/30 border border-transparent text-navy-300 hover:bg-navy-800/50 hover:text-white'
                          )}
                        >
                          <span className="text-sm">{option.label}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full mt-4 px-4 py-2 text-sm text-danger-400 hover:text-danger-300 hover:bg-danger-500/10 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

