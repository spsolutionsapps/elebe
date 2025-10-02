import React, { Suspense, lazy, ComponentType } from 'react'
import { LoadingSpinner } from './loading'

interface LazyComponentProps {
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function LazyComponent({ fallback, children }: LazyComponentProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner size="md" />}>
      {children}
    </Suspense>
  )
}

// Lazy loading de componentes específicos
export const LazyImageGallery = lazy(() => import('./optimized-image').then(module => ({ default: module.ImageGallery })))
export const LazyProductForm = lazy(() => import('../examples/ProductFormWithValidation'))
export const LazyAdminDashboard = lazy(() => import('../../app/admin/page'))

// Hook para lazy loading dinámico
export function useLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <LoadingSpinner size="md" />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Componente para lazy loading con intersection observer
interface LazyIntersectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazyIntersection({ 
  children, 
  fallback, 
  threshold = 0.1, 
  rootMargin = '50px',
  className 
}: LazyIntersectionProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
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
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (fallback || <LoadingSpinner size="md" />)}
    </div>
  )
}
