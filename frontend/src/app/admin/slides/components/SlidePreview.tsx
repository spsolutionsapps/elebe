'use client'

import { Button } from '@/components/ui/button'
import { Slide } from '@/types'
import { getImageUrl as getImageUrlFromConfig } from '@/lib/config'

// Función para obtener la URL de la imagen
function getImageUrl(imagePath: string): string {
  return getImageUrlFromConfig(imagePath);
}

interface SlidePreviewProps {
  slide: Slide | null
  onClose: () => void
}

export default function SlidePreview({ slide, onClose }: SlidePreviewProps) {
  if (!slide) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Vista Previa del Slide</h3>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            ✕
          </Button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Vista previa del slide */}
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-4">
            <img
              src={getImageUrl(slide.image)}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
              <div className="flex items-center h-full p-6">
                <div className="text-white max-w-2xl">
                  <h1 
                    className="text-2xl md:text-4xl font-bold mb-2"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />
                  {slide.subtitle && (
                    <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-200">
                      {slide.subtitle}
                    </h2>
                  )}
                  {slide.description && (
                    <p className="text-sm md:text-base mb-4 text-gray-200">
                      {slide.description}
                    </p>
                  )}
                  {slide.buttonText && (
                    slide.buttonLink ? (
                      <a 
                        href={slide.buttonLink}
                        className="inline-block px-6 py-3 font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        style={{
                          backgroundColor: slide.buttonBackgroundColor || '#F7DA4D',
                          color: slide.buttonTextColor || '#005DB9',
                          borderColor: slide.buttonBorderColor || 'transparent',
                          borderWidth: slide.buttonBorderColor ? (slide.buttonBorderWidth || '2px') : '0px',
                          borderStyle: 'solid',
                          borderRadius: slide.buttonBorderRadius || '0px',
                          boxShadow: slide.buttonBoxShadow || '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                        dangerouslySetInnerHTML={{ __html: slide.buttonText }}
                      />
                    ) : (
                      <span 
                        className="inline-block px-6 py-3 font-semibold text-sm transition-all duration-300 shadow-lg"
                        style={{
                          backgroundColor: slide.buttonBackgroundColor || '#F7DA4D',
                          color: slide.buttonTextColor || '#005DB9',
                          borderColor: slide.buttonBorderColor || 'transparent',
                          borderWidth: slide.buttonBorderColor ? (slide.buttonBorderWidth || '2px') : '0px',
                          borderStyle: 'solid',
                          borderRadius: slide.buttonBorderRadius || '0px',
                          boxShadow: slide.buttonBoxShadow || '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                        dangerouslySetInnerHTML={{ __html: slide.buttonText }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Información del slide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Información del Slide:</h4>
              <p><strong>Título:</strong> {slide.title}</p>
              <p><strong>Orden:</strong> {slide.order}</p>
              <p><strong>Estado:</strong> {slide.isActive ? 'Activo' : 'Inactivo'}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Estilos del Botón:</h4>
              <p><strong>Fondo:</strong> {slide.buttonBackgroundColor || '#F7DA4D'}</p>
              <p><strong>Texto:</strong> {slide.buttonTextColor || '#005DB9'}</p>
              <p><strong>Borde:</strong> {slide.buttonBorderColor || 'Sin borde'}</p>
              <p><strong>Radio:</strong> {slide.buttonBorderRadius || '0px'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
