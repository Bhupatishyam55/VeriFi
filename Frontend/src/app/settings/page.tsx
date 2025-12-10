'use client'

import React from 'react'
import { Settings, Bell, Shield, Database, User, Key, Globe } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Settings</h1>
        <p className="text-navy-400 mt-1">
          Configure your system preferences and security settings
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center">
              <User className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Profile Settings</h2>
              <p className="text-sm text-navy-400">Manage your account information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-navy-400 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="Admin User"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-navy-400 mb-2">Email</label>
              <input
                type="email"
                defaultValue="admin@apfinance.gov.in"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-navy-400 mb-2">Department</label>
              <input
                type="text"
                defaultValue="Finance Department"
                className="input-field"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm text-navy-400 mb-2">Role</label>
              <input
                type="text"
                defaultValue="System Administrator"
                className="input-field"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Notification Preferences</h2>
              <p className="text-sm text-navy-400">Configure how you receive alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Critical Fraud Alerts', description: 'Immediate notification for high-risk documents', enabled: true },
              { label: 'Daily Summary Reports', description: 'Receive daily digest of scan activity', enabled: true },
              { label: 'Duplicate Detection Alerts', description: 'Notify when duplicates are found', enabled: true },
              { label: 'System Updates', description: 'Get notified about platform updates', enabled: false },
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-navy-800/30 rounded-xl">
                <div>
                  <p className="font-medium text-white">{setting.label}</p>
                  <p className="text-sm text-navy-400">{setting.description}</p>
                </div>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    setting.enabled ? 'bg-gold-400' : 'bg-navy-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      setting.enabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-danger-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-danger-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Security Settings</h2>
              <p className="text-sm text-navy-400">Manage your security preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-navy-800/30 rounded-xl hover:bg-navy-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-navy-400" />
                <div className="text-left">
                  <p className="font-medium text-white">Change Password</p>
                  <p className="text-sm text-navy-400">Last changed 30 days ago</p>
                </div>
              </div>
              <span className="text-gold-400">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-navy-800/30 rounded-xl hover:bg-navy-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-navy-400" />
                <div className="text-left">
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-success-400">Enabled</p>
                </div>
              </div>
              <span className="text-gold-400">→</span>
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-success-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">System Information</h2>
              <p className="text-sm text-navy-400">Platform status and version info</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Platform Version', value: 'v2.4.1' },
              { label: 'Database Size', value: '70 TB' },
              { label: 'AI Model', value: 'FraudNet v3' },
              { label: 'Uptime', value: '99.99%' },
            ].map((item, index) => (
              <div key={index} className="p-4 bg-navy-800/30 rounded-xl text-center">
                <p className="text-xs text-navy-400 mb-1">{item.label}</p>
                <p className="font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button className="btn-ghost">Cancel</button>
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  )
}

