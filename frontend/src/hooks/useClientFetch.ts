import { useEffect, useState, useRef } from 'react'

export function useClientFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchData = async () => {
      // Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      try {
        setLoading(true)
        setError(null)
        
        // Crear nuevo AbortController
        abortControllerRef.current = new AbortController()
        
        const response = await fetch(url, {
          ...options,
          signal: abortControllerRef.current.signal,
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        // Solo mostrar error si no es un aborto intencional
        if (err instanceof Error && err.name !== 'AbortError') {
          const errorMessage = err.message
          console.error('Fetch error:', errorMessage)
          setError(errorMessage)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [mounted, url, JSON.stringify(options)])

  return { data, loading, error, mounted }
}
