'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface FraudGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeConfig = {
  sm: { width: 120, height: 60, strokeWidth: 8, fontSize: 'text-2xl' },
  md: { width: 180, height: 90, strokeWidth: 12, fontSize: 'text-4xl' },
  lg: { width: 240, height: 120, strokeWidth: 16, fontSize: 'text-5xl' },
}

export function FraudGauge({ score, size = 'md' }: FraudGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const config = sizeConfig[size]
  
  // Get color based on score
  const getColor = (s: number) => {
    if (s < 30) return { stroke: '#22c55e', text: 'text-success-400', label: 'Low Risk' }
    if (s < 70) return { stroke: '#f59e0b', text: 'text-warning-400', label: 'Medium Risk' }
    return { stroke: '#ef4444', text: 'text-danger-400', label: 'High Risk' }
  }

  const color = getColor(score)

  // Animate score on mount
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = score / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  // SVG arc calculations
  const radius = (config.width - config.strokeWidth) / 2
  const circumference = Math.PI * radius
  const progress = (animatedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.width, height: config.height }}>
        <svg
          width={config.width}
          height={config.height + 10}
          viewBox={`0 0 ${config.width} ${config.height + 10}`}
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={`M ${config.strokeWidth / 2} ${config.height} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.height}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <path
            d={`M ${config.strokeWidth / 2} ${config.height} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.height}`}
            fill="none"
            stroke={color.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${color.stroke}50)`,
            }}
          />
        </svg>

        {/* Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className={cn('font-display font-bold', config.fontSize, color.text)}>
            {animatedScore}
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <p className={cn('text-sm font-semibold', color.text)}>{color.label}</p>
        <p className="text-xs text-navy-500 mt-0.5">Fraud Score</p>
      </div>
    </div>
  )
}

