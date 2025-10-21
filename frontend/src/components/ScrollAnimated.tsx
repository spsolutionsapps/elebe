'use client'

import { useSlideAnimation } from '@/hooks/useScrollAnimation'
import { ReactNode } from 'react'

interface ScrollAnimatedProps {
  children: ReactNode
  direction?: 'left' | 'right' | 'top' | 'center'
  className?: string
  delay?: number
}

export function ScrollAnimated({ 
  children, 
  direction = 'left', 
  className = '',
  delay = 0
}: ScrollAnimatedProps) {
  const { elementRef, animationClasses } = useSlideAnimation(direction)

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${animationClasses} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}


