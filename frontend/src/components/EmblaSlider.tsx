'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slide } from '@/types'
import { motion } from 'framer-motion'
import { getImageUrl } from '@/lib/imageUtils'

interface EmblaSliderProps {
  slides: Slide[]
}

export function EmblaSlider({ slides }: EmblaSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

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
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  if (!slides || slides.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay slides disponibles</p>
      </div>
    )
  }

  return (
    <div 
      className="relative w-screen h-[calc(100vh-64px)] -ml-4 sm:-ml-6 lg:-ml-8"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
    >
      {/* Main carousel container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
              {/* Slide image */}
              <div className="relative h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">
                <img
                  src={getImageUrl(slide.image)}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">Error al cargar la imagen</p>
                </div>

                {/* Slide content overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
                  <div className="flex items-center h-full">
                    <div className="text-white p-8 max-w-2xl">
                      <motion.h1
                        key={`title-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                      >
                        {slide.title}
                      </motion.h1>
                      
                      {slide.subtitle && (
                        <motion.h2
                          key={`subtitle-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xl md:text-2xl font-semibold mb-4 text-blue-200"
                        >
                          {slide.subtitle}
                        </motion.h2>
                      )}
                      
                      {slide.description && (
                        <motion.p
                          key={`description-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-lg md:text-xl mb-6 text-gray-200"
                        >
                          {slide.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {slides.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {selectedIndex + 1} / {slides.length}
        </div>
      )}
    </div>
  )
}
