'use client'

import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slide } from '@/types'
import { getImageUrl } from '@/lib/imageUtils'
import { gsap } from 'gsap'

// Función helper para procesar HTML de manera segura - memoizada
const processHtmlContent = (html: string): string => {
  if (!html) return ''
  
  // Decodificar entidades HTML si están escapadas
  const decoded = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
  
  return decoded
}

// Función para detectar si el contenido contiene HTML - memoizada
const containsHtml = (text: string): boolean => {
  if (!text) return false
  return /<[^>]*>/g.test(text)
}

// Función para renderizar contenido con o sin HTML - memoizada
const renderTitle = (title: string): { __html: string } => {
  if (!title) return { __html: '' }
  
  const processedTitle = processHtmlContent(title)
  const hasHtml = containsHtml(processedTitle)
  
  if (hasHtml) {
    return { __html: processedTitle }
  } else {
    return { __html: title }
  }
}

// Función para renderizar texto del botón con HTML - memoizada
const renderButtonText = (buttonText: string): { __html: string } => {
  if (!buttonText) return { __html: '' }
  
  const processedText = processHtmlContent(buttonText)
  const hasHtml = containsHtml(processedText)
  
  if (hasHtml) {
    return { __html: processedText }
  } else {
    return { __html: buttonText }
  }
}

interface GSAPSliderProps {
  slides: Slide[]
  onControls?: (controls: {
    handleNext: () => void
    handlePrev: () => void
    handleDotClick: (index: number) => void
    handlePlayPause: () => void
    currentIndex: number
    isPlaying: boolean
  }) => void
}

const GSAPSlider = memo(function GSAPSlider({ slides, onControls }: GSAPSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<HTMLDivElement[]>([])
  const textRefs = useRef<HTMLDivElement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Función para animar los textos
  const animateTexts = useCallback((slideIndex: number, isEntering: boolean = true) => {
    if (textRefs.current.length === 0) return

    const textContainer = textRefs.current[slideIndex]
    if (!textContainer) return

    const title = textContainer.querySelector('.slide-title')
    const subtitle = textContainer.querySelector('.slide-subtitle')
    const description = textContainer.querySelector('.slide-description')

    // Verificar que los elementos existen antes de animar
    const elementsToAnimate = [title, subtitle, description].filter(el => el !== null)
    if (elementsToAnimate.length === 0) return

    if (isEntering) {
      // Establecer estado inicial invisible
      gsap.set(elementsToAnimate, {
        opacity: 0,
        y: 50,
        scale: 0.8
      })

      // Animación de entrada secuencial
      const tl = gsap.timeline()
      
      // Título - efecto más dramático
      if (title) {
        tl.to(title, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        })
      }
      
      // Subtítulo - desde la izquierda
      if (subtitle) {
        tl.to(subtitle, {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.4")
      }
      
      // Descripción - aparición suave
      if (description) {
        tl.to(description, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.3")
      }

    } else {
      // Animación de salida rápida
      gsap.to(elementsToAnimate, {
        opacity: 0,
        y: -30,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in"
      })
    }
  }, [])

  // Función para animar el slider
  const animateSlider = useCallback((direction: 'next' | 'prev' | 'to', targetIndex?: number) => {
    if (!containerRef.current || slides.length === 0) return

    const container = containerRef.current
    const slideElements = slidesRef.current

    if (slideElements.length === 0) return

    let newIndex: number

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % slides.length
    } else if (direction === 'prev') {
      newIndex = (currentIndex - 1 + slides.length) % slides.length
    } else {
      newIndex = targetIndex || 0
    }

    // Calcular el porcentaje de desplazamiento
    const translateX = -newIndex * (100 / slides.length)

    // Animar textos del slide actual (salida) - más rápido
    animateTexts(currentIndex, false)

    // Crear timeline para sincronizar todo
    const tl = gsap.timeline()

    // Animar el contenedor
    tl.to(container, {
      xPercent: translateX,
      duration: 0.8,
      ease: "power2.inOut"
    })

    // Animar elementos individuales
    slideElements.forEach((slide, index) => {
      if (!slide) return // Verificar que el elemento existe
      
      const isActive = index === newIndex
      
      if (isActive) {
        // Slide activo - animación de entrada
        tl.fromTo(slide, 
          { 
            scale: 0.95,
            opacity: 0.8
          },
          { 
            scale: 1, 
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          }, "-=0.6" // Inicia antes de que termine el movimiento
        )
      } else {
        // Slides no activos
        tl.to(slide, {
          scale: 0.95,
          opacity: 0.7,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.8")
      }
    })

    // Animar textos del nuevo slide (entrada) - después de que el slide sea visible
    tl.call(() => {
      setCurrentIndex(newIndex)
      // Pequeño delay para que el slide esté completamente visible
      setTimeout(() => {
        animateTexts(newIndex, true)
      }, 200)
    }, [], "-=0.4")

  }, [currentIndex, slides.length, animateTexts])

  // Autoplay
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return

    const interval = setInterval(() => {
      animateSlider('next')
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying, animateSlider, slides.length])

  // Inicializar animaciones
  useEffect(() => {
    if (slides.length === 0 || !containerRef.current) return

    // Configurar estado inicial
    gsap.set(containerRef.current, { xPercent: 0 })
    slidesRef.current.forEach((slide, index) => {
      if (slide) { // Verificar que el elemento existe
        gsap.set(slide, {
          scale: index === 0 ? 1 : 0.95,
          opacity: index === 0 ? 1 : 0.7
        })
      }
    })

    // Configurar textos iniciales como invisibles
    textRefs.current.forEach((textContainer, index) => {
      if (textContainer) {
        const title = textContainer.querySelector('.slide-title')
        const subtitle = textContainer.querySelector('.slide-subtitle')
        const description = textContainer.querySelector('.slide-description')
        
        // Verificar que los elementos existen antes de configurar
        const elementsToSet = [title, subtitle, description].filter(el => el !== null)
        if (elementsToSet.length > 0) {
          gsap.set(elementsToSet, {
            opacity: 0,
            y: 50,
            scale: 0.8
          })
        }
      }
    })

    // Animar textos del primer slide después de un delay
    setTimeout(() => {
      animateTexts(0, true)
    }, 500)
  }, [slides.length, animateTexts])

  // Handlers optimizados con useCallback
  const handleNext = useCallback(() => {
    setIsPlaying(false)
    animateSlider('next')
  }, [animateSlider])

  const handlePrev = useCallback(() => {
    setIsPlaying(false)
    animateSlider('prev')
  }, [animateSlider])

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleDotClick = useCallback((index: number) => {
    setIsPlaying(false)
    animateSlider('to', index)
  }, [animateSlider])

  // Memoizar la función renderTitle para evitar recreaciones
  const memoizedRenderTitle = useCallback((title: string) => {
    return renderTitle(title)
  }, [])

  // Memoizar la función renderButtonText para evitar recreaciones
  const memoizedRenderButtonText = useCallback((buttonText: string) => {
    return renderButtonText(buttonText)
  }, [])

  // Memoizar el procesamiento de imágenes
  const getOptimizedImageUrl = useCallback((image: string) => {
    return getImageUrl(image)
  }, [])

  // Pasar controles al callback
  useEffect(() => {
    if (onControls) {
      onControls({
        handleNext,
        handlePrev,
        handleDotClick,
        handlePlayPause,
        currentIndex,
        isPlaying
      })
    }
  }, [currentIndex, isPlaying, onControls, handleNext, handlePrev, handleDotClick, handlePlayPause])

  if (!slides || slides.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay slides disponibles</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[calc(100vh-8rem-60px)] overflow-hidden mx-auto" style={{ marginTop: '2rem' }}>
      {/* Contenedor principal del slider */}
      <div 
        ref={containerRef}
        className="flex h-full"
        style={{ width: `${slides.length * 100}%` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => {
              if (el) slidesRef.current[index] = el
            }}
            className="relative flex-shrink-0 w-full h-full"
            style={{ width: `${100 / slides.length}%` }}
          >
            {/* Imagen del slide */}
            <div className="relative h-full bg-gradient-to-br from-gray-900 to-gray-700 overflow-hidden">
              <img
                src={getOptimizedImageUrl(slide.image)}
                alt={slide.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📷</span>
                  </div>
                  <p className="text-lg">Imagen no disponible</p>
                </div>
              </div>

              
              {/* Contenido del slide */}
              <div className="absolute inset-0 flex items-center">
                <div 
                  ref={(el) => {
                    if (el) textRefs.current[index] = el
                  }}
                  className="p-8 md:p-12 max-w-4xl"
                  style={{ color: '#1E4BA6' }}
                >
                  <div className="space-y-6">
                   {/* Título */}
                    <h1 
                      className="slide-title text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
                      style={{
                        color: slide.titleColor || '#1E4BA6',
                        fontSize: slide.titleSize || undefined,
                        textShadow: slide.titleShadow || undefined
                      }}
                      dangerouslySetInnerHTML={memoizedRenderTitle(slide.title || '')}
                    />
                    
                    {/* Subtítulo */}
                    {slide.subtitle && (
                      <h2 className="slide-subtitle text-xl md:text-2xl lg:text-3xl font-semibold"
                          style={{ color: '#1E4BA6' }}>
                        {slide.subtitle}
                      </h2>
                    )}
                    
                    {/* Botón */}
                    {slide.buttonText && (
                      <div className="slide-button">
                        {slide.buttonLink ? (
                          <a 
                            href={slide.buttonLink}
                            className="inline-block px-8 py-4 font-semibold text-lg transition-colors duration-300"
                            style={{ 
                              backgroundColor: slide.buttonBackgroundColor || '#F7DA4D', 
                              color: slide.buttonTextColor || '#005DB9',
                              borderColor: slide.buttonBorderColor || 'transparent',
                              borderWidth: slide.buttonBorderColor ? (slide.buttonBorderWidth || '2px') : '0px',
                              borderStyle: 'solid',
                              borderRadius: slide.buttonBorderRadius || '0px',
                              boxShadow: slide.buttonBoxShadow || '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                            dangerouslySetInnerHTML={memoizedRenderButtonText(slide.buttonText)}
                          />
                        ) : (
                          <span 
                            className="inline-block px-8 py-4 font-semibold text-lg transition-colors duration-300"
                            style={{ 
                              backgroundColor: slide.buttonBackgroundColor || '#F7DA4D', 
                              color: slide.buttonTextColor || '#005DB9',
                              borderColor: slide.buttonBorderColor || 'transparent',
                              borderWidth: slide.buttonBorderColor ? (slide.buttonBorderWidth || '2px') : '0px',
                              borderStyle: 'solid',
                              borderRadius: slide.buttonBorderRadius || '0px',
                              boxShadow: slide.buttonBoxShadow || '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                            dangerouslySetInnerHTML={memoizedRenderButtonText(slide.buttonText)}
                          />
                        )}
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de reproducción */}
      {slides.length > 1 && (
        <div className="absolute top-6 right-6 flex space-x-2">
          <button
            onClick={handlePlayPause}
            className="bg-black/50 hover:bg-black/70 text-white border border-white/30 p-2 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          
          {/* Contador de slides */}
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
            <span>{currentIndex + 1}</span>
            <span className="mx-1">/</span>
            <span>{slides.length}</span>
          </div>
        </div>
      )}
    </div>
  )
})

export { GSAPSlider }
