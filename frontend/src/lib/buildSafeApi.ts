/**
 * Build-safe API utilities
 * Handles API calls during build time (SSG) gracefully
 */

import { getApiUrl } from './config'

/**
 * Check if we're in build time (SSG) where backend might not be available
 */
export function isBuildTime(): boolean {
  return (
    process.env.NODE_ENV === 'production' && 
    !process.env.NEXT_PUBLIC_BACKEND_URL &&
    typeof window === 'undefined'
  )
}

/**
 * Safe fetch that handles build time gracefully
 */
export async function buildSafeFetch(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response | null> {
  try {
    // Si estamos en build time, no hacer fetch
    if (isBuildTime()) {
      console.log(`🔧 Build time detected, skipping fetch to ${endpoint}`)
      return null
    }

    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      // Agregar timeout para evitar colgarse
      signal: AbortSignal.timeout(5000)
    })
    
    return response
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return null
  }
}

/**
 * Safe fetch with JSON parsing that handles build time gracefully
 */
export async function buildSafeFetchJson<T>(
  endpoint: string, 
  options: RequestInit = {},
  fallback: T
): Promise<T> {
  try {
    const response = await buildSafeFetch(endpoint, options)
    
    if (!response || !response.ok) {
      console.warn(`⚠️ Failed to fetch ${endpoint}, using fallback data`)
      return fallback
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching JSON from ${endpoint}:`, error)
    return fallback
  }
}

/**
 * Safe fetch for pages that need data during build
 */
export async function buildSafePageData<T>(
  endpoint: string,
  fallback: T,
  options: RequestInit = {}
): Promise<T> {
  // Si estamos en build time, retornar fallback inmediatamente
  if (isBuildTime()) {
    console.log(`🔧 Build time: using fallback data for ${endpoint}`)
    return fallback
  }

  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      signal: AbortSignal.timeout(5000)
    })
    
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      console.warn(`⚠️ API returned ${response.status} for ${endpoint}, using fallback`)
      return fallback
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return fallback
  }
}
