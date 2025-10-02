import { useEffect, useState } from 'react'

export function useClientFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching from:', url)
        const response = await fetch(url, options)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        console.log('Fetch successful:', result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error('Fetch error:', errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [mounted, url, JSON.stringify(options)])

  return { data, loading, error, mounted }
}
