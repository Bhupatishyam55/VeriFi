'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Upload, FileText, X, CloudUpload, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { validateFile, formatFileSize as formatSize } from '@/lib/file-validation'
import { useToast } from '@/components/providers/ToastProvider'

interface DropZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = useCallback((file: File) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file')
      addToast({
        type: 'error',
        title: 'File Validation Failed',
        message: validation.error || 'Please select a valid file',
      })
      return
    }
    setValidationError(null)
    setSelectedFile(file)
  }, [addToast])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        processFile(files[0])
      }
    },
    [disabled, processFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile]
  )

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      const validation = validateFile(selectedFile)
      if (!validation.valid) {
        addToast({
          type: 'error',
          title: 'File Validation Failed',
          message: validation.error || 'Please select a valid file',
        })
        return
      }
      onFileSelect(selectedFile)
    }
  }, [selectedFile, onFileSelect, addToast])

  const clearFile = useCallback(() => {
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])


  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer',
          isDragging
            ? 'border-gold-400 bg-gold-400/5 scale-[1.02]'
            : 'border-navy-700 hover:border-navy-600 bg-navy-800/30',
          disabled && 'opacity-50 cursor-not-allowed',
          selectedFile && 'border-success-500/50 bg-success-500/5'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          disabled={disabled}
        />

        {/* Animated background pattern */}
        <div className="absolute inset-0 pattern-dots opacity-50 rounded-2xl" />

        <div className="relative flex flex-col items-center text-center">
          {selectedFile ? (
            <>
              <div className="w-20 h-20 rounded-2xl bg-success-500/10 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-success-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">File Ready</h3>
              <div className="flex items-center gap-2 text-navy-400 mb-4">
                <span className="text-success-400 font-medium">{selectedFile.name}</span>
                <span className="text-navy-600">•</span>
                <span>{formatSize(selectedFile.size)}</span>
              </div>
              {validationError && (
                <div className="flex items-center gap-2 text-danger-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationError}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div
                className={cn(
                  'w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300',
                  isDragging
                    ? 'bg-gold-400/20 scale-110'
                    : 'bg-navy-700'
                )}
              >
                <CloudUpload
                  className={cn(
                    'w-10 h-10 transition-colors',
                    isDragging ? 'text-gold-400' : 'text-navy-400'
                  )}
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragging ? 'Drop your file here' : 'Drag & Drop your document'}
              </h3>
              <p className="text-navy-400 mb-6">
                or <span className="text-gold-400 underline">browse files</span> from your computer
              </p>
            </>
          )}

          {/* Supported formats */}
          <div className="flex items-center gap-2 text-xs text-navy-500">
            <span>Supported:</span>
            {['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'JPG', 'PNG'].map((format) => (
              <span
                key={format}
                className="px-2 py-1 bg-navy-700/50 rounded text-navy-400"
              >
                {format}
              </span>
            ))}
          </div>
        </div>

        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute inset-0 border-2 border-gold-400 rounded-2xl animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Selected File Preview & Actions */}
      {selectedFile && (
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center">
                <FileText className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <p className="font-medium text-white">{selectedFile.name}</p>
                <p className="text-sm text-navy-400">
                  {formatSize(selectedFile.size)} • Ready for scanning
                </p>
                {validationError && (
                  <p className="text-sm text-danger-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile()
                }}
                className="p-2 text-navy-400 hover:text-danger-400 hover:bg-danger-500/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleUpload()
                }}
                disabled={disabled}
                className={cn(
                  'btn-primary flex items-center gap-2',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Check className="w-5 h-5" />
                Start Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

