'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2, Image as ImageIcon, Eye } from 'lucide-react'
import { Slide } from '@/types'
import { getImageUrl as getImageUrlFromConfig } from '@/lib/config'

// Función para obtener la URL de la imagen
function getImageUrl(imagePath: string): string {
  return getImageUrlFromConfig(imagePath);
}

interface SlideCardProps {
  slide: Slide
  onEdit: (slide: Slide) => void
  onDelete: (id: string) => void
  onPreview: (slide: Slide) => void
}

export default function SlideCard({ slide, onEdit, onDelete, onPreview }: SlideCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-0 md:p-4 w-full">
        <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
          {slide.image ? (
            <img
              src={getImageUrl(slide.image)}
              alt={slide.title || 'Slide'}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <ImageIcon className="h-12 w-12 text-gray-400" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">{slide.title || 'Sin título'}</h3>
          <p className="hidden">
            {slide.description || 'Sin descripción'}
          </p>
          <p className="text-xs text-gray-500">Orden: {slide.order}</p>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreview(slide)}
            className="rounded-full md:px-4 px-2"
          >
            <Eye className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Vista Previa</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(slide)}
            className="rounded-full md:px-4 px-2"
          >
            <Edit className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Editar</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(slide.id)}
            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-full md:px-4 px-2"
          >
            <Trash2 className="h-4 w-4 md:mr-1 text-white" />
            <span className="hidden md:inline">Eliminar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
