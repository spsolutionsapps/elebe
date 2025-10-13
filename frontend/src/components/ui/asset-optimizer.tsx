import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AssetOptimizerProps {
  children: React.ReactNode
  className?: string
  lazy?: boolean
  threshold?: number
  rootMargin?: string
}

export function AssetOptimizer({ 
  children, 
  className, 
  lazy = true, 
  threshold = 0.1, 
  rootMargin = '50px' 
}: AssetOptimizerProps) {
  const [isVisible, setIsVisible] = useState(!lazy)
  const [isLoaded, setIsLoaded] = useState(!lazy)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lazy) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [lazy, threshold, rootMargin])

  useEffect(() => {
    if (isVisible && !isLoaded) {
      // Simulate loading delay for better UX
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isVisible, isLoaded])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {isVisible && children}
    </div>
  )
}

// Componente para optimización de fuentes
interface FontOptimizerProps {
  children: React.ReactNode
  className?: string
  preload?: boolean
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
}

export function FontOptimizer({ 
  children, 
  className, 
  preload = true, 
  display = 'swap' 
}: FontOptimizerProps) {
  useEffect(() => {
    if (preload) {
      // Preload critical fonts
      const fonts = [
        'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap',
        'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap'
      ]

      fonts.forEach(fontUrl => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'style'
        link.href = fontUrl
        document.head.appendChild(link)
      })
    }
  }, [preload])

  return (
    <div className={cn('font-optimized', className)}>
      {children}
    </div>
  )
}

// Componente para optimización de CSS
interface CSSOptimizerProps {
  children: React.ReactNode
  className?: string
  critical?: boolean
}

export function CSSOptimizer({ children, className, critical = false }: CSSOptimizerProps) {
  const [isLoaded, setIsLoaded] = useState(!critical)

  useEffect(() => {
    if (critical) {
      setIsLoaded(true)
      return
    }

    // Load non-critical CSS after page load
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [critical])

  return (
    <div
      className={cn(
        'css-optimized',
        isLoaded ? 'loaded' : 'loading',
        className
      )}
    >
      {children}
    </div>
  )
}

// Hook para optimización de recursos
export function useResourceOptimization() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionType, setConnectionType] = useState<string>('unknown')

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Get connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      setConnectionType(connection.effectiveType || 'unknown')
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Determine if we should load high-quality assets
  const shouldLoadHighQuality = isOnline && (
    connectionType === '4g' || 
    connectionType === '3g' || 
    connectionType === 'unknown'
  )

  // Determine if we should preload assets
  const shouldPreload = isOnline && connectionType === '4g'

  return {
    isOnline,
    connectionType,
    shouldLoadHighQuality,
    shouldPreload
  }
}

// Componente para optimización de videos
interface VideoOptimizerProps {
  src: string
  poster?: string
  className?: string
  lazy?: boolean
  quality?: 'low' | 'medium' | 'high'
}

export function VideoOptimizer({ 
  src, 
  poster, 
  className, 
  lazy = true, 
  quality = 'medium' 
}: VideoOptimizerProps) {
  const [isVisible, setIsVisible] = useState(!lazy)
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  const { shouldLoadHighQuality } = useResourceOptimization()

  useEffect(() => {
    if (!lazy) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [lazy])

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

  return (
    <div className={cn('relative', className)}>
      {isVisible && (
        <video
          ref={ref}
          src={src}
          poster={poster}
          onLoadedData={handleLoadedData}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          preload={shouldLoadHighQuality ? 'metadata' : 'none'}
          playsInline
          muted
        />
      )}
    </div>
  )
}

// Componente para optimización de iconos
interface IconOptimizerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  lazy?: boolean
}

export function IconOptimizer({ 
  children, 
  className, 
  size = 'md', 
  lazy = true 
}: IconOptimizerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  if (!lazy) {
    return (
      <div className={cn(sizeClasses[size], className)}>
        {children}
      </div>
    )
  }

  return (
    <AssetOptimizer className={cn(sizeClasses[size], className)}>
      {children}
    </AssetOptimizer>
  )
}
