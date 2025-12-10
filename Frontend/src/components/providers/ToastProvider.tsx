'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Toast {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
}

const styles = {
  info: 'border-blue-500/50 bg-blue-500/10',
  warning: 'border-warning-500/50 bg-warning-500/10',
  error: 'border-danger-500/50 bg-danger-500/10',
  success: 'border-success-500/50 bg-success-500/10',
}

const iconStyles = {
  info: 'text-blue-400',
  warning: 'text-warning-400',
  error: 'text-danger-400',
  success: 'text-success-400',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration (default 5s)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md">
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          
          return (
            <div
              key={toast.id}
              className={cn(
                'animate-slide-in glass-card border-l-4 p-4 shadow-2xl',
                styles[toast.type]
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[toast.type])} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white">{toast.title}</h4>
                  <p className="text-sm text-navy-300 mt-1">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-navy-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

