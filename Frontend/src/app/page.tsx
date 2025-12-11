'use client'

import React, { useEffect, useState } from 'react'
import { FileSearch, AlertTriangle, IndianRupee, Clock, TrendingUp, Shield, Database } from 'lucide-react'
import { StatsCard } from '@/components/ui/StatsCard'
import { DashboardChart } from '@/features/dashboard/DashboardChart'
import { LiveFeed } from '@/features/dashboard/LiveFeed'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { FilterPanel, type FilterGroup } from '@/components/ui/FilterPanel'
import { ExportButton } from '@/components/ui/ExportButton'
import { fetchDashboardStats, type DashboardStats } from '@/lib/api'
import { formatCurrency, formatNumber } from '@/lib/utils'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  const filterOptions: FilterGroup[] = [
    {
      id: 'severity',
      label: 'Severity',
      type: 'multiple',
      options: [
        { id: 'safe', label: 'Safe', value: 'safe' },
        { id: 'warning', label: 'Warning', value: 'warning' },
        { id: 'critical', label: 'Critical', value: 'critical' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'multiple',
      options: [
        { id: 'completed', label: 'Completed', value: 'completed' },
        { id: 'pending', label: 'Pending', value: 'pending' },
        { id: 'processing', label: 'Processing', value: 'processing' },
      ],
    },
  ]

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await fetchDashboardStats()
        setStats(data)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-sm md:text-base text-navy-400 mt-1">
            Real-time monitoring of document validation and fraud detection
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <FilterPanel filters={filterOptions} onFilterChange={setFilters} />
          {stats && <ExportButton data={stats} filename="dashboard-stats" variant="ghost" />}
          <div className="flex items-center gap-2 px-4 py-2 glass-card">
            <Database className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-navy-300">
              Processing <span className="text-gold-400 font-semibold">70TB</span> of Records
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass-card">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
            <span className="text-sm text-navy-300">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card animate-pulse">
                <div className="w-12 h-12 bg-navy-700 rounded-xl mb-4" />
                <div className="h-4 bg-navy-700 rounded w-1/2 mb-2" />
                <div className="h-8 bg-navy-700 rounded w-3/4" />
              </div>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Scanned"
              value={formatNumber(stats?.total_scanned || 0)}
              subtitle="Documents processed"
              icon={FileSearch}
              trend={{ value: 12.5, isPositive: true }}
              variant="gold"
            />
            <StatsCard
              title="Fraud Detected"
              value={stats?.fraud_detected || 0}
              subtitle="Suspicious documents"
              icon={AlertTriangle}
              trend={{ value: 8.2, isPositive: false }}
              variant="danger"
            />
            <StatsCard
              title="Total Savings"
              value={formatCurrency(stats?.total_savings || 0)}
              subtitle="Prevented losses"
              icon={IndianRupee}
              trend={{ value: 23.1, isPositive: true }}
              variant="success"
            />
            <StatsCard
              title="Pending Review"
              value={stats?.pending_review || 0}
              subtitle="Awaiting action"
              icon={Clock}
              variant="default"
            />
          </>
        )}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-gold-400" />
          </div>
          <div>
            <p className="text-sm text-navy-400">Detection Accuracy</p>
            <p className="text-2xl font-display font-bold text-white">
              {stats?.accuracy_rate || 99.7}%
            </p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success-400/20 to-success-400/5 flex items-center justify-center">
            <Shield className="w-7 h-7 text-success-400" />
          </div>
          <div>
            <p className="text-sm text-navy-400">Protected Transactions</p>
            <p className="text-2xl font-display font-bold text-white">
              {formatNumber(stats?.total_scanned ? stats.total_scanned * 2.5 : 35500)}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-400/5 flex items-center justify-center">
            <Database className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-navy-400">Database Coverage</p>
            <p className="text-2xl font-display font-bold text-white">70 TB</p>
          </div>
        </div>
      </div>

      {/* Chart and Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <div className="w-full h-[300px]">
            <DashboardChart />
          </div>
        </div>
        <div className="lg:col-span-1">
          <LiveFeed />
        </div>
      </div>

      {/* Recent Alerts Section */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Critical Alerts</h3>
        <div className="space-y-3">
          {[
            {
              id: 1,
              title: 'Duplicate Invoice Detected',
              description: 'Invoice #INV-2024-5521 matches existing record from March 2024',
              department: 'Treasury Department',
              time: '5 min ago',
              amount: '₹45,00,000',
            },
            {
              id: 2,
              title: 'Forged Signature Alert',
              description: 'Pixel alteration detected in Contract #CON-2024-1102',
              department: 'Public Works',
              time: '23 min ago',
              amount: '₹12,50,000',
            },
            {
              id: 3,
              title: 'Vendor Blacklist Match',
              description: 'GST number linked to blacklisted entity in Bill #BIL-2024-8834',
              department: 'Health Services',
              time: '1 hour ago',
              amount: '₹8,75,000',
            },
          ].map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-4 p-4 bg-danger-500/5 border border-danger-500/20 rounded-xl hover:bg-danger-500/10 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 bg-danger-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-danger-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{alert.title}</p>
                  <span className="badge-critical">{alert.amount}</span>
                </div>
                <p className="text-sm text-navy-400 mt-0.5">{alert.description}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-navy-500">
                  <span>{alert.department}</span>
                  <span>•</span>
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

