import { v4 as uuidv4 } from 'uuid'

export interface Anomaly {
  type: string
  description: string
  confidence: number
}

export interface ScanResult {
  file_id: string
  filename: string
  status: 'pending' | 'scanning' | 'completed' | 'error'
  fraud_score: number
  severity: 'SAFE' | 'WARNING' | 'CRITICAL'
  is_duplicate: boolean
  duplicate_source_id: string | null
  anomalies: Anomaly[]
  scanned_at: string
  processing_time: number
}

export interface DashboardStats {
  total_scanned: number
  fraud_detected: number
  total_savings: number
  pending_review: number
  accuracy_rate: number
}

export interface ChartDataPoint {
  date: string
  uploads: number
  fraud: number
}

export interface RecentFile {
  id: string
  filename: string
  department: string
  status: 'safe' | 'warning' | 'critical'
  fraud_score: number
  scanned_at: string
}

// Simulated scan results for demo purposes
const mockAnomalies: Anomaly[][] = [
  [
    { type: 'Metadata Mismatch', description: 'Creation date is in the future', confidence: 0.98 },
    { type: 'Forged Signature', description: 'Pixel alteration detected around signature area', confidence: 0.92 },
  ],
  [
    { type: 'Duplicate Invoice', description: 'Same invoice number found in Treasury records from March 2024', confidence: 0.99 },
    { type: 'Amount Discrepancy', description: 'Invoice total differs from line items by ₹45,000', confidence: 0.87 },
    { type: 'Vendor Mismatch', description: 'Vendor GST number linked to a blacklisted entity', confidence: 0.94 },
  ],
  [
    { type: 'Font Inconsistency', description: 'Multiple font types detected suggesting document tampering', confidence: 0.85 },
  ],
  [], // Clean document
]

/**
 * Simulates a document scan with AI-powered fraud detection
 * Returns after a 3-second delay to simulate processing
 */
export async function simulateScan(file: File): Promise<ScanResult> {
  // Store the file info for the result
  const fileId = uuidv4()
  const startTime = Date.now()

  // Simulate the 3-second processing time
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Randomly determine if this is a high-risk document (for demo purposes)
  const isHighRisk = Math.random() > 0.4
  const isDuplicate = isHighRisk && Math.random() > 0.5

  // Select appropriate anomalies based on risk level
  const anomalyIndex = isHighRisk 
    ? Math.floor(Math.random() * (mockAnomalies.length - 1)) 
    : mockAnomalies.length - 1
  
  const anomalies = mockAnomalies[anomalyIndex]
  
  // Calculate fraud score based on anomalies
  let fraudScore = 0
  if (anomalies.length > 0) {
    const avgConfidence = anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length
    fraudScore = Math.round(avgConfidence * 100 * (0.5 + anomalies.length * 0.2))
    fraudScore = Math.min(fraudScore, 98) // Cap at 98
  } else {
    fraudScore = Math.floor(Math.random() * 15) + 5 // 5-20 for clean docs
  }

  // Determine severity
  let severity: 'SAFE' | 'WARNING' | 'CRITICAL'
  if (fraudScore < 30) severity = 'SAFE'
  else if (fraudScore < 70) severity = 'WARNING'
  else severity = 'CRITICAL'

  const result: ScanResult = {
    file_id: fileId,
    filename: file.name,
    status: 'completed',
    fraud_score: fraudScore,
    severity,
    is_duplicate: isDuplicate,
    duplicate_source_id: isDuplicate ? `doc-${Math.floor(Math.random() * 10000)}` : null,
    anomalies,
    scanned_at: new Date().toISOString(),
    processing_time: Date.now() - startTime,
  }

  // Store in localStorage for retrieval on results page
  if (typeof window !== 'undefined') {
    localStorage.setItem(`scan_result_${fileId}`, JSON.stringify(result))
  }

  return result
}

/**
 * Retrieves a scan result by ID
 */
export function getScanResult(fileId: string): ScanResult | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(`scan_result_${fileId}`)
  if (stored) {
    return JSON.parse(stored)
  }
  
  // Return a demo result if not found
  return {
    file_id: fileId,
    filename: 'invoice_demo.pdf',
    status: 'completed',
    fraud_score: 88,
    severity: 'CRITICAL',
    is_duplicate: true,
    duplicate_source_id: 'doc-5510',
    anomalies: [
      { type: 'Metadata Mismatch', description: 'Creation date is in the future', confidence: 0.98 },
      { type: 'Forged Signature', description: 'Pixel alteration detected around signature area', confidence: 0.92 },
    ],
    scanned_at: new Date().toISOString(),
    processing_time: 3000,
  }
}

/**
 * Gets dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    total_scanned: 14200,
    fraud_detected: 45,
    total_savings: 12000000, // ₹1.2Cr
    pending_review: 12,
    accuracy_rate: 99.7,
  }
}

/**
 * Gets chart data for uploads vs fraud over the last 7 days
 */
export async function getChartData(): Promise<ChartDataPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const today = new Date()
  const data: ChartDataPoint[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const uploads = Math.floor(Math.random() * 300) + 150
    const fraud = Math.floor(Math.random() * 8) + 2

    data.push({
      date: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      uploads,
      fraud,
    })
  }

  return data
}

/**
 * Gets recent files for the live feed
 */
export async function getRecentFiles(): Promise<RecentFile[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const departments = [
    'Treasury Department',
    'Public Works',
    'Health Services',
    'Education Board',
    'Revenue Department',
    'Municipal Corp',
    'Water Resources',
    'Transport Authority',
  ]

  const fileTypes = ['Invoice', 'Contract', 'Receipt', 'Agreement', 'Bill', 'Voucher']

  const files: RecentFile[] = []

  for (let i = 0; i < 8; i++) {
    const fraudScore = Math.floor(Math.random() * 100)
    let status: 'safe' | 'warning' | 'critical'
    
    if (fraudScore < 30) status = 'safe'
    else if (fraudScore < 70) status = 'warning'
    else status = 'critical'

    const date = new Date()
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 120))

    files.push({
      id: uuidv4(),
      filename: `${fileTypes[Math.floor(Math.random() * fileTypes.length)]}_${Math.floor(Math.random() * 9000) + 1000}.pdf`,
      department: departments[Math.floor(Math.random() * departments.length)],
      status,
      fraud_score: fraudScore,
      scanned_at: date.toISOString(),
    })
  }

  // Sort by time, most recent first
  return files.sort((a, b) => new Date(b.scanned_at).getTime() - new Date(a.scanned_at).getTime())
}

