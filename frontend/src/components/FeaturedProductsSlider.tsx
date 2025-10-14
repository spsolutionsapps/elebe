'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { getImageUrl } from '@/lib/config'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import { ProductImage } from '@/components/OptimizedImage'
import { AddToCartButtonCompact } from '@/components/AddToCartButton'
import Image from 'next/image'

// Función para generar slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .trim()
}

interface FeaturedProductsSliderProps {
  products: Product[]
}

export function FeaturedProductsSlider({ products }: FeaturedProductsSliderProps) {
  console.log('🎠 FeaturedProductsSlider: Received products:', products?.length || 0)
  console.log('🎠 FeaturedProductsSlider: Products data:', products)
  
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: isMobile ? 1 : 1,
    breakpoints: {
      '(min-width: 768px)': { 
        slidesToScroll: 1,
        containScroll: 'trimSnaps'
      },
      '(max-width: 767px)': { 
        slidesToScroll: 1,
        containScroll: 'trimSnaps'
      }
    }
  })
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  // Check if mobile on mount and resize
  useEffect(() => {
    setIsClient(true)
    
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)
      }
    }
    
    // Initial check
    if (typeof window !== 'undefined') {
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  // Reinitialize Embla when screen size changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
    }
  }, [isMobile, emblaApi])

  if (!products || !Array.isArray(products) || products.length === 0) {
    return null
  }

  // SSR fallback - show static grid
  if (!isClient) {
    return (
      <div className="relative padding120Desk">
        <h2 className="text-3xl font-bold verde font-heading mb-8">
          Productos <em>más buscados</em> 
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => {
            const productSlug = generateSlug(product.name)
            return (
            <div key={product.id} className="group">
              <Link href={`/producto/${productSlug}`}>
                <div className="transition-all duration-300 group-hover:scale-105 py-2 px-2">
                  <div className="aspect-square mb-4 flex items-center justify-center overflow-hidden bg-gray-800">
                    {product.image ? (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-400 text-xs">Sin imagen</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-blue transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-white font-medium">
                      {product.category}
                    </p>
                    <AddToCartButtonCompact
                      productId={product.id}
                      productName={product.name}
                      productDescription={product.description}
                      productImage={product.image ? getImageUrl(product.image) : undefined}
                      productPrice={product.price || undefined}
                      className="mt-2"
                    />
                  </div>
                </div>
              </Link>
            </div>
            )
          })}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/catalogo">
            <Button className="btnAmarillo py-4 noBorderRadius hover:bg-blue-700 hover:text-white px-8 py-3  font-medium transition-colors text-base">
              Ver Todos los <em>productos</em> 
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Group products based on screen size
  const itemsPerSlide = isMobile ? 1 : 4
  const slides = []
  
  // For desktop: group 4 products per slide
  // For mobile: 1 product per slide
  for (let i = 0; i < products.length; i += itemsPerSlide) {
    const slideProducts = products.slice(i, i + itemsPerSlide)
    if (slideProducts.length > 0) {
      slides.push(slideProducts)
    }
  }


  return (
    <div className="relative padding120Desk">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold verde font-heading">
        Productos <em>más buscados</em> 
        </h2>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Navigation dots */}
          <div className="flex space-x-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex ? 'bg-white' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <div className="flex space-x-2">
            <button
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className="group flex items-center justify-center w-12 h-12 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300 disabled:opacity-30"
              style={{ backgroundColor: '#176A7B' }}
              aria-label="Slide anterior"
            >
              <div className="relative w-5 h-5">
                <div className="absolute top-1/2 left-0 w-4 h-0.5 bg-white transform -translate-y-1/2 rotate-45 origin-left group-hover:bg-white/80 transition-colors duration-300"></div>
                <div className="absolute top-1/2 left-0 w-4 h-0.5 bg-white transform -translate-y-1/2 -rotate-45 origin-left group-hover:bg-white/80 transition-colors duration-300"></div>
              </div>
            </button>
            <button
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              className="group flex items-center justify-center w-12 h-12 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300 disabled:opacity-30"
              style={{ backgroundColor: '#176A7B' }}
              aria-label="Slide siguiente"
            >
              <div className="relative w-5 h-5">
                <div className="absolute top-1/2 right-0 w-4 h-0.5 bg-white transform -translate-y-1/2 -rotate-45 origin-right group-hover:bg-white/80 transition-colors duration-300"></div>
                <div className="absolute top-1/2 right-0 w-4 h-0.5 bg-white transform -translate-y-1/2 rotate-45 origin-right group-hover:bg-white/80 transition-colors duration-300"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden">
        {/* Mobile navigation arrows */}
        <div className="md:hidden">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="group absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-16 h-16 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300 disabled:opacity-30"
            style={{ backgroundColor: '#176A7B' }}
            aria-label="Slide anterior"
          >
            <div className="relative w-6 h-6">
              <div className="absolute top-1/2 left-0 w-5 h-0.5 bg-white transform -translate-y-1/2 rotate-45 origin-left group-hover:bg-white/80 transition-colors duration-300"></div>
              <div className="absolute top-1/2 left-0 w-5 h-0.5 bg-white transform -translate-y-1/2 -rotate-45 origin-left group-hover:bg-white/80 transition-colors duration-300"></div>
            </div>
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="group absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-16 h-16 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300 disabled:opacity-30"
            style={{ backgroundColor: '#176A7B' }}
            aria-label="Slide siguiente"
          >
            <div className="relative w-6 h-6">
              <div className="absolute top-1/2 right-0 w-5 h-0.5 bg-white transform -translate-y-1/2 -rotate-45 origin-right group-hover:bg-white/80 transition-colors duration-300"></div>
              <div className="absolute top-1/2 right-0 w-5 h-0.5 bg-white transform -translate-y-1/2 rotate-45 origin-right group-hover:bg-white/80 transition-colors duration-300"></div>
            </div>
          </button>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} className="embla__slide flex-[0_0_100%] min-w-0 pl-4">
                <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
                  {slide.map((product) => {
                    const productSlug = generateSlug(product.name)
                    return (
                    <div key={product.id} className="group">
                      <Link href={`/producto/${productSlug}`}>
                        <div className="transition-all duration-300 group-hover:scale-105 py-2 px-2">
                          <div className="aspect-square mb-4 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="text-white text-sm">Sin imagen</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold verde text-md line-clamp-2 group-hover:text-blue transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xs sliderCategory verde font-medium">
                              {product.category}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile navigation dots */}
      <div className="md:hidden flex justify-center mt-6 space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === selectedIndex ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Ver todos los productos button */}
      <div className="flex justify-center mt-8">
        <Link href="/catalogo">
          <Button className="btnAmarillo noBorderRadius hover:bg-blue-700 hover:text-white px-8 py-6  font-medium transition-colors text-base">
            Ver Todos los <em>productos</em>
          </Button>
        </Link>
      </div>
    </div>
  )
}
