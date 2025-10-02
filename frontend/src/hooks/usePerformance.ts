import { useCallback, useMemo, useRef, useEffect } from 'react'

// Hook para optimización de rendering
export function usePerformance() {
  const renderCount = useRef(0)
  const startTime = useRef(performance.now())

  useEffect(() => {
    renderCount.current += 1
  })

  const getRenderTime = useCallback(() => {
    return performance.now() - startTime.current
  }, [])

  const resetTimer = useCallback(() => {
    startTime.current = performance.now()
  }, [])

  return {
    renderCount: renderCount.current,
    getRenderTime,
    resetTimer
  }
}

// Hook para memoización de cálculos pesados
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T {
  return useMemo(calculation, dependencies)
}

// Hook para debounce de funciones
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }) as T,
    [callback, delay]
  )
}

// Hook para throttle de funciones
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef(0)

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        callback(...args)
      }
    }) as T,
    [callback, delay]
  )
}

// Hook para lazy loading de datos
export function useLazyData<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  return { data, loading, error, fetchData }
}

// Hook para virtualización
export function useVirtualization(
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = React.useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount
  )

  const visibleItems = useMemo(() => {
    const items = []
    for (let i = visibleStart; i < visibleEnd; i++) {
      items.push({
        index: i,
        top: i * itemHeight,
        height: itemHeight
      })
    }
    return items
  }, [visibleStart, visibleEnd, itemHeight])

  const totalHeight = itemCount * itemHeight

  return {
    visibleItems,
    totalHeight,
    setScrollTop
  }
}

// Hook para intersection observer
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [hasIntersected, setHasIntersected] = React.useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      options
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options, hasIntersected])

  return { ref, isIntersecting, hasIntersected }
}

// Hook para performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<{
    renderTime: number
    memoryUsage: number
    fps: number
  }>({
    renderTime: 0,
    memoryUsage: 0,
    fps: 0
  })

  useEffect(() => {
    const measurePerformance = () => {
      // Measure render time
      const renderTime = performance.now()
      
      // Measure memory usage (if available)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
      
      // Measure FPS (simplified)
      const fps = 60 // This would need a more sophisticated implementation
      
      setMetrics({ renderTime, memoryUsage, fps })
    }

    const interval = setInterval(measurePerformance, 1000)
    return () => clearInterval(interval)
  }, [])

  return metrics
}
