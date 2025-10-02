import { useState, useEffect, useCallback } from 'react'

interface ImageOptimizationOptions {
  quality?: number
  format?: 'webp' | 'jpeg' | 'png' | 'avif'
  width?: number
  height?: number
  blur?: boolean
}

interface OptimizedImageData {
  src: string
  width: number
  height: number
  format: string
  size: number
  optimized: boolean
}

export function useImageOptimization() {
  const [isSupported, setIsSupported] = useState<{
    webp: boolean
    avif: boolean
  }>({ webp: false, avif: false })

  // Check browser support for modern formats
  useEffect(() => {
    const checkSupport = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1

      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      const avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0

      setIsSupported({ webp: webpSupported, avif: avifSupported })
    }

    checkSupport()
  }, [])

  // Generate optimized image URL
  const getOptimizedImageUrl = useCallback((
    originalSrc: string,
    options: ImageOptimizationOptions = {}
  ): string => {
    const {
      quality = 75,
      format,
      width,
      height,
      blur = false
    } = options

    // If it's already an optimized URL, return as is
    if (originalSrc.includes('_next/static') || originalSrc.includes('optimized')) {
      return originalSrc
    }

    // Determine best format
    let bestFormat = format
    if (!bestFormat) {
      if (isSupported.avif) {
        bestFormat = 'avif'
      } else if (isSupported.webp) {
        bestFormat = 'webp'
      } else {
        bestFormat = 'jpeg'
      }
    }

    // Build optimized URL
    const url = new URL(originalSrc, window.location.origin)
    
    // Add optimization parameters
    if (quality !== 75) url.searchParams.set('q', quality.toString())
    if (width) url.searchParams.set('w', width.toString())
    if (height) url.searchParams.set('h', height.toString())
    if (format) url.searchParams.set('f', bestFormat)
    if (blur) url.searchParams.set('blur', '1')

    return url.toString()
  }, [isSupported])

  // Get responsive image sources
  const getResponsiveSources = useCallback((
    originalSrc: string,
    sizes: number[] = [320, 640, 1024, 1280, 1920],
    options: ImageOptimizationOptions = {}
  ) => {
    return sizes.map(size => ({
      src: getOptimizedImageUrl(originalSrc, { ...options, width: size }),
      width: size,
      descriptor: `${size}w`
    }))
  }, [getOptimizedImageUrl])

  // Get srcset string
  const getSrcSet = useCallback((
    originalSrc: string,
    sizes: number[] = [320, 640, 1024, 1280, 1920],
    options: ImageOptimizationOptions = {}
  ): string => {
    const sources = getResponsiveSources(originalSrc, sizes, options)
    return sources.map(source => `${source.src} ${source.descriptor}`).join(', ')
  }, [getResponsiveSources])

  // Preload critical images
  const preloadImage = useCallback((src: string, options: ImageOptimizationOptions = {}) => {
    const optimizedSrc = getOptimizedImageUrl(src, options)
    
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = optimizedSrc
    
    document.head.appendChild(link)
    
    return () => {
      document.head.removeChild(link)
    }
  }, [getOptimizedImageUrl])

  // Get image dimensions
  const getImageDimensions = useCallback((src: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = reject
      img.src = src
    })
  }, [])

  // Calculate optimal size for container
  const getOptimalSize = useCallback((
    containerWidth: number,
    containerHeight: number,
    imageWidth: number,
    imageHeight: number,
    devicePixelRatio: number = 1
  ): { width: number; height: number } => {
    const ratio = Math.min(
      containerWidth / imageWidth,
      containerHeight / imageHeight
    )
    
    return {
      width: Math.round(imageWidth * ratio * devicePixelRatio),
      height: Math.round(imageHeight * ratio * devicePixelRatio)
    }
  }, [])

  // Generate placeholder
  const generatePlaceholder = useCallback((width: number, height: number, color: string = '#f3f4f6'): string => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return ''
    
    canvas.width = width
    canvas.height = height
    
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)
    
    return canvas.toDataURL()
  }, [])

  // Get image info
  const getImageInfo = useCallback(async (src: string): Promise<OptimizedImageData> => {
    try {
      const dimensions = await getImageDimensions(src)
      const response = await fetch(src, { method: 'HEAD' })
      const size = parseInt(response.headers.get('content-length') || '0')
      
      return {
        src,
        width: dimensions.width,
        height: dimensions.height,
        format: src.split('.').pop() || 'unknown',
        size,
        optimized: false
      }
    } catch (error) {
      console.error('Error getting image info:', error)
      return {
        src,
        width: 0,
        height: 0,
        format: 'unknown',
        size: 0,
        optimized: false
      }
    }
  }, [getImageDimensions])

  return {
    isSupported,
    getOptimizedImageUrl,
    getResponsiveSources,
    getSrcSet,
    preloadImage,
    getImageDimensions,
    getOptimalSize,
    generatePlaceholder,
    getImageInfo
  }
}

// Hook para lazy loading con intersection observer
export function useLazyImage(src: string, options?: IntersectionObserverInit) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [options])

  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setHasError(true)
      img.src = src
    }
  }, [isInView, src, isLoaded, hasError])

  return { imgRef, isLoaded, isInView, hasError }
}

// Hook para preload de imágenes críticas
export function useImagePreload(images: string[], options: ImageOptimizationOptions = {}) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const { getOptimizedImageUrl } = useImageOptimization()

  useEffect(() => {
    const loadImages = async () => {
      const promises = images.map(src => {
        const optimizedSrc = getOptimizedImageUrl(src, options)
        return new Promise<string>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(src)
          img.onerror = reject
          img.src = optimizedSrc
        })
      })

      try {
        const loaded = await Promise.all(promises)
        setLoadedImages(new Set(loaded))
      } catch (error) {
        console.error('Error preloading images:', error)
      }
    }

    loadImages()
  }, [images, getOptimizedImageUrl, options])

  return { loadedImages, isLoaded: (src: string) => loadedImages.has(src) }
}
