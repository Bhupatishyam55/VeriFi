const USE_MOCK_DATA = false
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1'

type WeeklyActivity = { day: string; uploads: number; fraud: number }
type RecentScan = { id: string; filename: string; status: string; timestamp: string }

export type DashboardStats = {
  total_scanned: number
  fraud_detected: number
  total_savings: number
  pending_review: number
  accuracy_rate: number
  weekly_activity: WeeklyActivity[]
  recent_scans: RecentScan[]
}

export type UploadResponse = {
  task_id: string
  message: string
}

export type Anomaly = {
  type: string
  description: string
  confidence: number
}

export type ScanResult = {
  file_id: string
  filename: string
  status: string
  fraud_score: number
  severity: 'SAFE' | 'WARNING' | 'CRITICAL'
  is_duplicate: boolean
  duplicate_source_id: string | null
  anomalies: Anomaly[]
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK_DATA) {
    await delay(300)
    return {
      total_scanned: 14200,
      fraud_detected: 45,
      total_savings: 12000000,
      pending_review: 12,
      accuracy_rate: 99.7,
      weekly_activity: [
        { day: 'Mon', uploads: 120, fraud: 2 },
        { day: 'Tue', uploads: 150, fraud: 5 },
        { day: 'Wed', uploads: 180, fraud: 1 },
        { day: 'Thu', uploads: 90, fraud: 0 },
        { day: 'Fri', uploads: 200, fraud: 8 },
        { day: 'Sat', uploads: 50, fraud: 0 },
        { day: 'Sun', uploads: 30, fraud: 0 },
      ],
      recent_scans: [
        { id: '1', filename: 'invoice_992.pdf', status: 'safe', timestamp: '2 mins ago' },
        { id: '2', filename: 'contract_v2.docx', status: 'warning', timestamp: '5 mins ago' },
      ],
    }
  }

  const res = await fetch(`${API_BASE}/dashboard/stats`)
  if (!res.ok) {
    throw new Error('Failed to load dashboard stats')
  }
  const data = await res.json()
  const summary = data.summary || {}
  return {
    total_scanned: summary.total_scanned ?? 0,
    fraud_detected: summary.fraud_detected ?? 0,
    total_savings: (summary.savings_in_crores ?? 0) * 10000000,
    pending_review: 12,
    accuracy_rate: 99.7,
    weekly_activity: data.weekly_activity ?? [],
    recent_scans: data.recent_scans ?? [],
  }
}

export async function uploadDocument(formData: FormData): Promise<UploadResponse> {
  if (USE_MOCK_DATA) {
    await delay(500)
    return { task_id: 'mock-uuid', message: 'File accepted' }
  }

  const res = await fetch(`${API_BASE}/scan/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    throw new Error('Failed to upload document')
  }
  return res.json()
}

export async function fetchScanResult(taskId: string): Promise<ScanResult> {
  if (USE_MOCK_DATA) {
    await delay(400)
    return {
      file_id: taskId,
      filename: 'invoice_demo.pdf',
      status: 'completed',
      fraud_score: 88,
      severity: 'CRITICAL',
      is_duplicate: true,
      duplicate_source_id: 'doc-5510',
      anomalies: [
        { type: 'Metadata Mismatch', description: 'Creation date is in the future', confidence: 0.98 },
        { type: 'Forged Signature', description: 'Pixel alteration detected', confidence: 0.92 },
      ],
    }
  }

  const res = await fetch(`${API_BASE}/scan/result/${taskId}`)
  if (!res.ok) {
    throw new Error('Failed to fetch scan result')
  }
  return res.json()
}

export async function triggerAlert(message: string): Promise<void> {
  if (USE_MOCK_DATA) {
    console.log('Alert triggered (Mock):', message)
    return
  }

  const res = await fetch(`${API_BASE}/admin/trigger-alert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) {
    throw new Error('Failed to trigger alert')
  }
}

