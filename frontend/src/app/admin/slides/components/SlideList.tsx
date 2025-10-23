'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Image as ImageIcon } from 'lucide-react'
import { Slide } from '@/types'
import SlideCard from './SlideCard'

interface SlideListProps {
  slides: Slide[]
  onNewSlide: () => void
  onEdit: (slide: Slide) => void
  onDelete: (id: string) => void
  onPreview: (slide: Slide) => void
}

export default function SlideList({ 
  slides, 
  onNewSlide, 
  onEdit, 
  onDelete, 
  onPreview 
}: SlideListProps) {
  return (
    <Card className="bg-white pb-6">
      <CardHeader style={{ paddingTop: '20px' }}>
        <div className="flex justify-between items-center p20">
          <CardTitle className="text-2xl font-bold">Gestión de Slides</CardTitle>
          <Button 
            onClick={onNewSlide}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            style={{
              backgroundColor: '#2563eb',
              borderColor: '#2563eb'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Slide
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              onEdit={onEdit}
              onDelete={onDelete}
              onPreview={onPreview}
            />
          ))}
        </div>

        {slides.length === 0 && (
          <div className="p-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay slides
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza creando tu primer slide para el home.
            </p>
            <Button 
              onClick={onNewSlide}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              style={{
                backgroundColor: '#2563eb',
                borderColor: '#2563eb'
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear primer slide
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
