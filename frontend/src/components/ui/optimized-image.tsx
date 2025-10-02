import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)
  const imgRef = useRef<HTMLImageElement>(null)

  // Generate blur placeholder
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    
    canvas.width = w
    canvas.height = h
    
    // Create a simple gradient blur
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)
    
    return canvas.toDataURL()
  }

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
    onLoad?.()
  }

  // Handle image error
  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Fallback image
  const fallbackSrc = '/images/placeholder.jpg'

  // Generate sizes if not provided
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

  // Generate blur data URL if not provided
  const defaultBlurDataURL = blurDataURL || (placeholder === 'blur' ? generateBlurDataURL(width || 400, height || 300) : undefined)

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-200 text-gray-500',
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-xs">Error al cargar imagen</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        sizes={defaultSizes}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  )
}

// Hook para lazy loading de imágenes
export function useLazyImage(src: string, options?: IntersectionObserverInit) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      options
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [options])

  useEffect(() => {
    if (isInView) {
      const img = new window.Image()
      img.onload = () => setIsLoaded(true)
      img.src = src
    }
  }, [isInView, src])

  return { imgRef, isLoaded, isInView }
}

// Componente para lazy loading
interface LazyImageProps extends OptimizedImageProps {
  threshold?: number
  rootMargin?: string
}

export function LazyImage({ threshold = 0.1, rootMargin = '50px', ...props }: LazyImageProps) {
  const { imgRef, isLoaded, isInView } = useLazyImage(props.src, { threshold, rootMargin })

  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={cn('bg-gray-200 animate-pulse', props.className)}
        style={{ width: props.width, height: props.height }}
      />
    )
  }

  return <OptimizedImage {...props} />
}

// Componente para galería de imágenes optimizada
interface ImageGalleryProps {
  images: string[]
  alt: string
  className?: string
  imageClassName?: string
  onImageClick?: (index: number) => void
}

export function ImageGallery({ 
  images, 
  alt, 
  className, 
  imageClassName,
  onImageClick 
}: ImageGalleryProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {images.map((src, index) => (
        <div
          key={index}
          className={cn('relative aspect-square cursor-pointer group', imageClassName)}
          onClick={() => onImageClick?.(index)}
        >
          <LazyImage
            src={src}
            alt={`${alt} ${index + 1}`}
            fill
            className="object-cover rounded-lg transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  )
}
