'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slide } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

import { getImageUrl as getImageUrlFromConfig } from '@/lib/config';

// Función para obtener la URL de la imagen
function getImageUrl(imagePath: string): string {
  return getImageUrlFromConfig(imagePath);
}

interface SlidesGalleryProps {
  slides: Slide[]
}

export function SlidesGallery({ slides }: SlidesGalleryProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => 
        prev === slides.length - 1 ? 0 : prev + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  if (!slides || slides.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay slides disponibles</p>
      </div>
    )
  }

  const handlePrevious = () => {
    setCurrentSlideIndex((prev) => 
      prev === 0 ? slides.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentSlideIndex((prev) => 
      prev === slides.length - 1 ? 0 : prev + 1
    )
  }

  const currentSlide = slides[currentSlideIndex]

  return (
    <div className="relative w-full">
      {/* Main slide container */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={getImageUrl(currentSlide.image)}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className="hidden w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Error al cargar la imagen</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide content overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
          <div className="flex items-center h-full">
            <div className="text-white p-8 max-w-2xl">
              <motion.h1
                key={`title-${currentSlideIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                {currentSlide.title}
              </motion.h1>
              
              {currentSlide.subtitle && (
                <motion.h2
                  key={`subtitle-${currentSlideIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl font-semibold mb-4 text-blue-200"
                >
                  {currentSlide.subtitle}
                </motion.h2>
              )}
              
              {currentSlide.description && (
                <motion.p
                  key={`description-${currentSlideIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl mb-6 text-gray-200"
                >
                  {currentSlide.description}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlideIndex
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
            {currentSlideIndex + 1} / {slides.length}
          </div>
        )}
      </div>
    </div>
  )
}
