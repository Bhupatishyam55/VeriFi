/**
 * File Validation Utilities
 */

export interface ValidationResult {
  valid: boolean
  error?: string
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/jpg',
]

const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.jpg',
  '.jpeg',
  '.png',
]

export function validateFile(file: File): ValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit. Please upload a smaller file.`,
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please select a valid file.',
    }
  }

  // Check file type
  const isValidType =
    ALLOWED_TYPES.includes(file.type) ||
    ALLOWED_EXTENSIONS.some((ext) =>
      file.name.toLowerCase().endsWith(ext.toLowerCase())
    )

  if (!isValidType) {
    return {
      valid: false,
      error: `File type not supported. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }
  }

  // Check for suspicious filenames
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.scr$/i,
    /\.vbs$/i,
    /\.js$/i,
  ]

  if (suspiciousPatterns.some((pattern) => pattern.test(file.name))) {
    return {
      valid: false,
      error: 'File type not allowed for security reasons.',
    }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

