'use client'

import React from 'react'
import { FileText, ZoomIn, ZoomOut, RotateCw, Download, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PDFViewerProps {
  filename: string
}

export function PDFViewer({ filename }: PDFViewerProps) {
  return (
    <div className="h-full flex flex-col bg-navy-800/30 rounded-2xl border border-navy-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 md:p-4 border-b border-navy-700 bg-navy-900/50">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-gold-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm font-medium text-white truncate">{filename}</p>
            <p className="text-xs text-navy-500">PDF Preview</p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
          <button className="p-1.5 md:p-2 text-navy-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs md:text-sm text-navy-400 px-1 md:px-2">100%</span>
          <button className="p-1.5 md:p-2 text-navy-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-navy-700 mx-1 md:mx-2 hidden sm:block" />
          <button className="p-1.5 md:p-2 text-navy-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">
            <RotateCw className="w-4 h-4" />
          </button>
          <button className="p-1.5 md:p-2 text-navy-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors hidden sm:block">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-1.5 md:p-2 text-navy-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Preview Area (Placeholder) */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Simulated document preview */}
        <div className="w-full max-w-md aspect-[8.5/11] bg-white rounded-lg shadow-2xl overflow-hidden relative">
          {/* Scanning effect overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="scanning-line" />
          </div>

          {/* Document content simulation */}
          <div className="p-8 h-full">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AP</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">GOVERNMENT OF ANDHRA PRADESH</p>
                    <p className="text-xs text-gray-600">FINANCE DEPARTMENT</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Invoice No.</p>
                  <p className="font-mono text-sm font-bold text-gray-800">INV-2024-5521</p>
                </div>
              </div>
            </div>

            {/* Content lines */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Date:</span>
                <span className="text-xs text-gray-800 font-medium">15 Nov 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Vendor:</span>
                <span className="text-xs text-gray-800 font-medium">ABC Constructions Pvt. Ltd.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">GST No:</span>
                <span className="text-xs text-gray-800 font-mono">37AABCS1429B1ZK</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800">
                    <tr>
                      <td className="py-1">Road Construction Works</td>
                      <td className="py-1 text-right">₹38,00,000</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material Supply</td>
                      <td className="py-1 text-right">₹5,00,000</td>
                    </tr>
                    <tr>
                      <td className="py-1">Labour Charges</td>
                      <td className="py-1 text-right">₹2,00,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-bold text-sm text-gray-800">
                  <span>Total Amount:</span>
                  <span>₹45,00,000</span>
                </div>
              </div>

              {/* Signature area with fraud indicator */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Authorized Signatory</p>
                    <div className="relative">
                      <div className="w-24 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs italic">
                        [Signature]
                      </div>
                      {/* Fraud indicator */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">Date</p>
                    <p className="text-xs text-gray-800">15/11/2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 pattern-grid opacity-20 pointer-events-none" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 p-4 border-t border-navy-700 bg-navy-900/50">
        <button className="text-sm text-navy-400 hover:text-white transition-colors">
          ← Previous Page
        </button>
        <span className="text-sm text-white">Page 1 of 1</span>
        <button className="text-sm text-navy-400 hover:text-white transition-colors">
          Next Page →
        </button>
      </div>
    </div>
  )
}

