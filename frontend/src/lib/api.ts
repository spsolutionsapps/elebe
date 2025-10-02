/**
 * Centralized API utility functions
 * This ensures consistent API calls across the entire application
 */

import { API_CONFIG } from './config';

const API_BASE_URL = API_CONFIG.BASE_URL

/**
 * Make a GET request to the API
 */
export const apiGet = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Make a POST request to the API
 */
export const apiPost = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Make a PUT request to the API
 */
export const apiPut = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Make a DELETE request to the API
 */
export const apiDelete = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Make a PATCH request to the API
 */
export const apiPatch = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Get the full API URL for an endpoint
 */
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`
