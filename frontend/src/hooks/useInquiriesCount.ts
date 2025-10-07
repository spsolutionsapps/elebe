import { useState, useEffect, useRef } from 'react'

export const useInquiriesCount = () => {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Solo ejecutar en el cliente, no durante SSR
    if (typeof window === 'undefined') {
      return
    }

    const fetchCount = async () => {
      // Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      try {
        setError(null)
        
        // Crear nuevo AbortController
        abortControllerRef.current = new AbortController()
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        const response = await fetch(`${apiUrl}/inquiries`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortControllerRef.current.signal,
        })
        
        if (response.ok) {
          const inquiries = await response.json()
          if (Array.isArray(inquiries)) {
            const pendingCount = inquiries.filter((inquiry: any) => 
              !inquiry.status || inquiry.status === 'pending' || inquiry.status === 'new'
            ).length
            setCount(pendingCount)
          } else {
            setCount(0)
          }
        } else {
          setError(`Error ${response.status}: ${response.statusText}`)
          setCount(0)
        }
      } catch (error) {
        // Solo mostrar error si no es un aborto intencional
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching inquiries count:', error)
          setError(`Error: ${error.message}`)
        }
        setCount(0)
      } finally {
        setLoading(false)
      }
    }

    // Fetch inicial
    fetchCount()
    
    // Actualizar cada 60 segundos (menos frecuente para reducir carga)
    intervalRef.current = setInterval(fetchCount, 60000)
    
    return () => {
      // Cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return { count, loading, error }
}
