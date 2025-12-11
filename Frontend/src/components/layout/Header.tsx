'use client'

import React, { useState } from 'react'
import { Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/ui/SearchBar'

const notifications = [
  {
    id: '1',
    title: 'Critical Alert',
    message: 'High fraud score detected in Invoice #5521',
    time: '2 min ago',
    type: 'error',
    unread: true,
  },
  {
    id: '2',
    title: 'Scan Complete',
    message: '23 documents processed successfully',
    time: '15 min ago',
    type: 'success',
    unread: true,
  },
  {
    id: '3',
    title: 'Weekly Report',
    message: 'Your weekly fraud detection report is ready',
    time: '1 hour ago',
    type: 'info',
    unread: false,
  },
]

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="hidden md:flex fixed top-0 left-72 right-0 h-16 bg-navy-900/60 backdrop-blur-xl border-b border-navy-800 z-30 items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl hidden lg:block">
        <SearchBar
          placeholder="Search documents, invoices, reports..."
          onSearch={(query) => {
            // Handle search - can be connected to search API
            console.log('Searching for:', query)
          }}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Data Status */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-navy-800/50 rounded-xl border border-navy-700">
          <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
          <span className="text-sm text-navy-300">
            <span className="text-white font-semibold">70TB</span> Database Active
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfile(false)
            }}
            className="relative p-2.5 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-gold-400/30 transition-all duration-300"
          >
            <Bell className="w-5 h-5 text-navy-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-navy-700">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'p-4 border-b border-navy-800 hover:bg-navy-800/50 cursor-pointer transition-colors',
                      notif.unread && 'bg-navy-800/30'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                          notif.type === 'error' && 'bg-danger-400',
                          notif.type === 'success' && 'bg-success-400',
                          notif.type === 'info' && 'bg-blue-400'
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm">{notif.title}</p>
                        <p className="text-xs text-navy-400 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-navy-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-navy-700">
                <button className="w-full text-center text-sm text-gold-400 hover:text-gold-300 font-medium">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile)
              setShowNotifications(false)
            }}
            className="flex items-center gap-3 p-2 pr-4 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-gold-400/30 transition-all duration-300"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-navy-900" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-navy-400">Finance Dept.</p>
            </div>
            <ChevronDown className="w-4 h-4 text-navy-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-card border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-navy-700">
                <p className="font-semibold text-white">Admin User</p>
                <p className="text-sm text-navy-400">admin@apfinance.gov.in</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-navy-300 hover:bg-navy-800/50 hover:text-white rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-danger-400 hover:bg-danger-500/10 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

