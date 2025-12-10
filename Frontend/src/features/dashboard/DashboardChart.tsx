'use client'

import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getChartData, type ChartDataPoint } from '@/lib/mock-api'

export function DashboardChart() {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const chartData = await getChartData()
      setData(chartData)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="glass-card p-6 h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-navy-400 text-sm">Loading chart data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Uploads vs Fraud Detection</h3>
          <p className="text-sm text-navy-400 mt-1">Document analysis over the last 7 days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gold-400" />
            <span className="text-sm text-navy-400">Uploads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-danger-400" />
            <span className="text-sm text-navy-400">Fraud Detected</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
              labelStyle={{ color: '#f8fafc' }}
              itemStyle={{ color: '#94a3b8' }}
            />
            <Bar
              yAxisId="left"
              dataKey="uploads"
              fill="#fbbf24"
              radius={[4, 4, 0, 0]}
              name="Uploads"
            />
            <Bar
              yAxisId="right"
              dataKey="fraud"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              name="Fraud Detected"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

