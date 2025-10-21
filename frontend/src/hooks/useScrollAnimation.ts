import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options

  const elementRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce])

  return { elementRef, isVisible }
}

// Hook específico para animaciones de slide
export const useSlideAnimation = (direction: 'left' | 'right' | 'top' | 'center' = 'left') => {
  const { elementRef, isVisible } = useScrollAnimation()

  const getAnimationClasses = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left':
          return 'opacity-0 transform -translate-x-12'
        case 'right':
          return 'opacity-0 transform translate-x-12'
        case 'top':
          return 'opacity-0 transform -translate-y-12'
        case 'center':
          return 'opacity-0 transform translate-y-8 scale-95'
        default:
          return 'opacity-0 transform -translate-x-12'
      }
    }
    return 'opacity-100 transform translate-x-0 translate-y-0 scale-100'
  }

  return {
    elementRef,
    animationClasses: getAnimationClasses()
  }
}
