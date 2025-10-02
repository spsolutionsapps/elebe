import { useState, useEffect } from 'react'

export const useInquiriesCount = () => {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // console.log('Hook - Estado actual:', { count, loading, error })

  useEffect(() => {
    // Solo ejecutar en el cliente, no durante SSR
    if (typeof window === 'undefined') {
      return
    }

    const fetchCount = async () => {
      try {
        setError(null)
        // console.log('Hook - Intentando hacer fetch a:', 'http://localhost:3001/api/inquiries')
        
        // Agregar timeout para evitar que se cuelgue
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        const response = await fetch(`${apiUrl}/inquiries`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        // console.log('Hook - Response status:', response.status)
        // console.log('Hook - Response ok:', response.ok)
        
        if (response.ok) {
          const inquiries = await response.json()
          // Verificar que inquiries es un array válido
          if (Array.isArray(inquiries)) {
            // Contar solo las consultas pendientes (new, pending, o sin status)
            const pendingCount = inquiries.filter((inquiry: any) => 
              !inquiry.status || inquiry.status === 'pending' || inquiry.status === 'new'
            ).length
            // console.log('Hook - Total consultas:', inquiries.length)
            // console.log('Hook - Consultas pendientes:', pendingCount)
            // console.log('Hook - Consultas encontradas:', inquiries.map((i: any) => ({ id: i.id, status: i.status })))
            setCount(pendingCount)
          } else {
            console.error('Hook - Response is not an array:', inquiries)
            setCount(0)
          }
        } else {
          console.error('Hook - Response not ok:', response.status, response.statusText)
          setError(`Error ${response.status}: ${response.statusText}`)
          setCount(0)
        }
      } catch (error) {
        console.error('Hook - Error fetching inquiries count:', error)
        console.error('Hook - Error type:', typeof error)
        console.error('Hook - Error message:', error instanceof Error ? error.message : 'Unknown error')
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            setError('Timeout: El servidor no respondió')
          } else if (error.message.includes('Failed to fetch')) {
            setError('Error de conexión: No se pudo conectar al servidor')
          } else {
            setError(`Error: ${error.message}`)
          }
        } else {
          setError('Error desconocido')
        }
        setCount(0)
      } finally {
        setLoading(false)
      }
    }

    // Intentar hacer fetch inmediatamente
    fetchCount()
    
    // Actualizar cada 30 segundos para mantener el conteo actualizado
    const interval = setInterval(fetchCount, 30000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  return { count, loading, error }
}
