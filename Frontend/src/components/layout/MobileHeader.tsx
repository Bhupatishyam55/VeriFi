'use client'

import React, { useState } from 'react'
import { Menu, X, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Upload,
  FileSearch,
  Settings,
  HelpCircle,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import { useToast } from '@/components/providers/ToastProvider'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Smart Upload', icon: Upload },
  { href: '/results/demo', label: 'Analysis Results', icon: FileSearch },
]

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help & Support', icon: HelpCircle },
]

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { addToast } = useToast()

  const triggerDemoAlert = () => {
    addToast({
      type: 'error',
      title: '⚠️ ALERT: High-Value Fraud Detected',
      message: 'Critical anomaly detected in Treasury Department. Invoice #INV-2024-5521 flagged for immediate review. Estimated exposure: ₹45 Lakhs.',
      duration: 8000,
    })
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Header - Visible only on mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-navy-900/95 backdrop-blur-xl border-b border-navy-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-glow-gold">
            <Shield className="w-6 h-6 text-navy-900" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base text-white">AP FraudShield</h1>
            <p className="text-xs text-navy-400">Finance Department</p>
          </div>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-navy-300 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 transition-opacity duration-300',
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={cn(
          'md:hidden fixed left-0 top-0 h-full w-72 bg-navy-900/95 backdrop-blur-xl border-r border-navy-800 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-navy-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-glow-gold">
                <Shield className="w-7 h-7 text-navy-900" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-white">AP FraudShield</h1>
                <p className="text-xs text-navy-400">Finance Department</p>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider px-4 mb-3">
              Main Menu
            </p>
            
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-gold-400/10 to-transparent text-gold-400 border-l-2 border-gold-400'
                      : 'text-navy-300 hover:bg-navy-800/50 hover:text-white'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-gold-400' : 'text-navy-400 group-hover:text-gold-400')} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-gold-400" />}
                </Link>
              )
            })}

            {/* Demo Alert Trigger */}
            <div className="pt-6">
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider px-4 mb-3">
                Demo Controls
              </p>
              <button
                onClick={triggerDemoAlert}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-danger-500/10 border border-danger-500/30 text-danger-400 hover:bg-danger-500/20 transition-all duration-300"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium text-sm">Trigger Alert Demo</span>
              </button>
            </div>
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-navy-800">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-navy-400 rounded-xl hover:bg-navy-800/50 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Government Branding */}
          <div className="p-4 border-t border-navy-800">
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-navy-400">Powered by</p>
              <p className="font-display font-semibold text-gold-400 mt-1">
                Government of Andhra Pradesh
              </p>
              <p className="text-xs text-navy-500 mt-1">Finance Department</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

