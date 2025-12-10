export type SeverityLevel = 'SAFE' | 'WARNING' | 'CRITICAL'

export type StatusType = 'safe' | 'warning' | 'critical'

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  timestamp: Date
  read: boolean
}

export interface ScanStep {
  id: string
  label: string
  status: 'pending' | 'in-progress' | 'completed'
}

export interface Toast {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  duration?: number
}

