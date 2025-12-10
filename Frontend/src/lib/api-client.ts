/**
 * Enhanced API Client with Retry Logic, Timeout, and Error Handling
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1'
const DEFAULT_TIMEOUT = 30000 // 30 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout - server took too long to respond')
    }
    throw error
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestOptions = {},
  retries = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options)

      // Retry on 5xx errors or network errors
      if (!response.ok && response.status >= 500 && attempt < retries) {
        await sleep(RETRY_DELAY * (attempt + 1)) // Exponential backoff
        continue
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new ApiError(
          `API request failed: ${errorText}`,
          response.status,
          response
        )
      }

      return response
    } catch (error) {
      lastError = error as Error

      // Don't retry on 4xx errors (client errors)
      if (error instanceof ApiError && error.status && error.status < 500) {
        throw error
      }

      // Retry on network errors
      if (attempt < retries) {
        await sleep(RETRY_DELAY * (attempt + 1))
        continue
      }
    }
  }

  throw lastError || new ApiError('Request failed after retries')
}

/**
 * Enhanced fetch wrapper with retry, timeout, and better error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`

  try {
    const response = await fetchWithRetry(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    // Handle empty responses
    const text = await response.text()
    if (!text) {
      return {} as T
    }

    return JSON.parse(text) as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Network error - please check your connection and try again'
      )
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    )
  }
}

/**
 * File upload with progress tracking
 */
export async function uploadFile(
  endpoint: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          onProgress(progress)
        }
      })
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve({
            ok: true,
            status: xhr.status,
            json: async () => response,
            text: async () => xhr.responseText,
          } as Response)
        } catch {
          reject(new ApiError('Invalid JSON response'))
        }
      } else {
        reject(
          new ApiError(
            `Upload failed: ${xhr.statusText}`,
            xhr.status
          )
        )
      }
    })

    xhr.addEventListener('error', () => {
      reject(new ApiError('Network error during upload'))
    })

    xhr.addEventListener('abort', () => {
      reject(new ApiError('Upload cancelled'))
    })

    xhr.open('POST', url)
    const formData = new FormData()
    formData.append('file', file)
    xhr.send(formData)
  })
}

export { ApiError }

