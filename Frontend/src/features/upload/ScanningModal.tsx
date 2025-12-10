'use client'

import React, { useEffect, useState } from 'react'
import { Check, Loader2, Shield, Database, FileSearch, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface ScanStep {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  status: 'pending' | 'in-progress' | 'completed'
}

interface ScanningModalProps {
  isOpen: boolean
  filename: string
  onComplete: () => void
}

const initialSteps: ScanStep[] = [
  {
    id: 'metadata',
    label: 'Extracting Metadata',
    description: 'Reading document properties and hidden data...',
    icon: <FileSearch className="w-5 h-5" />,
    status: 'pending',
  },
  {
    id: 'comparison',
    label: 'Comparing with 70TB Database',
    description: 'Cross-referencing against historical records...',
    icon: <Database className="w-5 h-5" />,
    status: 'pending',
  },
  {
    id: 'ai',
    label: 'AI Fraud Analysis',
    description: 'Running deep learning models for pattern detection...',
    icon: <Shield className="w-5 h-5" />,
    status: 'pending',
  },
  {
    id: 'validation',
    label: 'Validation Complete',
    description: 'Generating comprehensive report...',
    icon: <AlertTriangle className="w-5 h-5" />,
    status: 'pending',
  },
]

export function ScanningModal({ isOpen, filename, onComplete }: ScanningModalProps) {
  const [steps, setSteps] = useState<ScanStep[]>(initialSteps)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setSteps(initialSteps)
      setProgress(0)
      setCurrentStep(0)
      return
    }

    // Simulate scanning progress
    const stepDuration = 750 // ms per step

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 30)

    // Update steps sequentially
    const stepTimeouts: NodeJS.Timeout[] = []

    steps.forEach((_, index) => {
      // Start step
      stepTimeouts.push(
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((step, i) => ({
              ...step,
              status: i === index ? 'in-progress' : i < index ? 'completed' : 'pending',
            }))
          )
          setCurrentStep(index)
        }, index * stepDuration)
      )

      // Complete step
      stepTimeouts.push(
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((step, i) => ({
              ...step,
              status: i <= index ? 'completed' : step.status,
            }))
          )
        }, (index + 1) * stepDuration - 100)
      )
    })

    // Complete the scan
    const completeTimeout = setTimeout(() => {
      onComplete()
    }, steps.length * stepDuration + 200)

    return () => {
      clearInterval(progressInterval)
      stepTimeouts.forEach(clearTimeout)
      clearTimeout(completeTimeout)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 glass-card border border-navy-700 shadow-2xl animate-fade-in overflow-hidden">
        {/* Scanning animation line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-navy-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-400/10 mb-4">
              <Shield className="w-8 h-8 text-gold-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-display font-bold text-white">Scanning Document</h2>
            <p className="text-navy-400 mt-2 text-sm">
              Analyzing <span className="text-gold-400 font-medium">{filename}</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <ProgressBar progress={progress} variant="gold" size="md" showLabel />
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl transition-all duration-500',
                  step.status === 'completed' && 'bg-success-500/5 border border-success-500/20',
                  step.status === 'in-progress' && 'bg-gold-400/5 border border-gold-400/20',
                  step.status === 'pending' && 'bg-navy-800/30 border border-transparent opacity-50'
                )}
              >
                {/* Status Icon */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                    step.status === 'completed' && 'bg-success-500/20 text-success-400',
                    step.status === 'in-progress' && 'bg-gold-400/20 text-gold-400',
                    step.status === 'pending' && 'bg-navy-700 text-navy-500'
                  )}
                >
                  {step.status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : step.status === 'in-progress' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p
                    className={cn(
                      'font-medium transition-colors',
                      step.status === 'completed' && 'text-success-400',
                      step.status === 'in-progress' && 'text-gold-400',
                      step.status === 'pending' && 'text-navy-500'
                    )}
                  >
                    {step.label}
                  </p>
                  <p
                    className={cn(
                      'text-sm mt-0.5 transition-colors',
                      step.status === 'pending' ? 'text-navy-600' : 'text-navy-400'
                    )}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Step Number */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    step.status === 'completed' && 'bg-success-500/20 text-success-400',
                    step.status === 'in-progress' && 'bg-gold-400/20 text-gold-400',
                    step.status === 'pending' && 'bg-navy-700 text-navy-500'
                  )}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-navy-500">
              This may take a few moments. Please do not close this window.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

