'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExportButtonProps {
  data: unknown
  filename?: string
  className?: string
  variant?: 'default' | 'ghost'
}

export function ExportButton({
  data,
  filename = 'export',
  className,
  variant = 'default',
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleExportClick = (exportFn: () => void) => {
    setIsOpen(false)
    exportFn()
  }

  const exportToJSON = () => {
    setIsExporting(true)
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
    URL.revokeObjectURL(url)
    setIsExporting(false)
  }

  const exportToCSV = () => {
    setIsExporting(true)
    try {
      // Convert data to CSV
      let csv = ''
      if (Array.isArray(data)) {
        if (data.length > 0) {
          // Get headers
          const headers = Object.keys(data[0])
          csv += headers.join(',') + '\n'

          // Get rows
          data.forEach((row) => {
            csv += headers.map((header) => {
              const value = row[header]
              // Escape commas and quotes
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return value ?? ''
            }).join(',') + '\n'
          })
        }
      } else if (typeof data === 'object') {
        // Convert object to key-value pairs
        csv = 'Key,Value\n'
        Object.entries(data).forEach(([key, value]) => {
          csv += `${key},${value}\n`
        })
      }

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('CSV export failed:', error)
    }
    setIsExporting(false)
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    // For PDF export, we'd typically use a library like jsPDF or pdfmake
    // For now, we'll create a simple HTML-based PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #0f172a; color: white; }
            </style>
          </head>
          <body>
            <h1>${filename}</h1>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
    setIsExporting(false)
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => !isExporting && setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300',
          variant === 'default'
            ? 'btn-primary'
            : 'btn-ghost',
          isExporting && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={isExporting}
        aria-label="Export options"
        aria-expanded={isOpen}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export</span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isExporting && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-48 glass-card border border-navy-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in"
        >
          <button
            onClick={() => handleExportClick(exportToCSV)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-navy-300 hover:bg-navy-800/50 hover:text-white transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-sm">Export as CSV</span>
          </button>
          <button
            onClick={() => handleExportClick(exportToJSON)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-navy-300 hover:bg-navy-800/50 hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Export as JSON</span>
          </button>
          <button
            onClick={() => handleExportClick(exportToPDF)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-navy-300 hover:bg-navy-800/50 hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Export as PDF</span>
          </button>
        </div>
      )}
    </div>
  )
}

