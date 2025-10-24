'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye } from 'lucide-react'
import { Slide } from '@/types'
import ImageUpload from '@/components/ImageUpload'
import ButtonStyleEditor from './ButtonStyleEditor'
import TitleStyleEditor from './TitleStyleEditor'

interface SlideFormProps {
  formData: {
    title: string
    buttonText: string
    buttonLink: string
    buttonBackgroundColor: string
    buttonTextColor: string
    buttonBorderColor: string
    buttonBorderWidth: string
    buttonBorderRadius: string
    buttonBoxShadow: string
    titleColor: string
    titleSize: string
    titleShadow: string
    image: string
    order: number
  }
  editingSlide: Slide | null
  onFormDataChange: (field: string, value: string | number) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  onPreview: () => void
}

export default function SlideForm({
  formData,
  editingSlide,
  onFormDataChange,
  onSubmit,
  onCancel,
  onPreview
}: SlideFormProps) {
  const handleStyleChange = (field: string, value: string) => {
    onFormDataChange(field, value)
  }

  const handleReset = () => {
    onFormDataChange('buttonBackgroundColor', '#F7DA4D')
    onFormDataChange('buttonTextColor', '#005DB9')
    onFormDataChange('buttonBorderColor', '')
    onFormDataChange('buttonBorderWidth', '2px')
    onFormDataChange('buttonBorderRadius', '0px')
    onFormDataChange('buttonBoxShadow', '')
  }


  return (
    <Card className="bg-white pb-6 bg-white">
      <CardHeader style={{ padding: '20px 0 0 20px' }}>
        <CardTitle className="text-3xl font-bold text-black" style={{ fontSize: '1.5rem', fontWeight: '900', color: 'black' }}>
          {editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Campos principales en una fila */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onFormDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título del slide"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes usar HTML para cambiar colores y estilos.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Texto del Botón
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => onFormDataChange('buttonText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Texto del botón"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Enlace del Botón
              </label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) => onFormDataChange('buttonLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com (opcional)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional. Si no se especifica, el botón será solo decorativo.
              </p>
            </div>
          </div>

          {/* Estilos del Título */}
          <TitleStyleEditor
            key={`title-editor-${formData.titleColor}-${formData.titleSize}-${formData.titleShadow}`}
            formData={formData}
            onStyleChange={handleStyleChange}
            onReset={() => {
              onFormDataChange('titleColor', '#1E4BA6')
              onFormDataChange('titleSize', '4rem')
              onFormDataChange('titleShadow', 'none')
            }}
            onExample={() => {}}
          />

          {/* Estilos del Botón */}
          <ButtonStyleEditor
            formData={formData}
            onStyleChange={handleStyleChange}
            onReset={handleReset}
            onExample={() => {}}
          />

          {/* Imagen después de la vista previa */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">
              Imagen
            </label>
            <ImageUpload
              key={`image-upload-${editingSlide?.id || 'new'}`}
              onImageUpload={(imageUrl) => onFormDataChange('image', imageUrl)}
              currentImage={formData.image}
            />
          </div>
          
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Orden del Slide en la Home
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => onFormDataChange('order', parseInt(e.target.value))}
                className="w-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                style={{
                  backgroundColor: '#2563eb',
                  borderColor: '#2563eb'
                }}
              >
                {editingSlide ? 'Actualizar' : 'Publicar Slide'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onPreview}
                className="rounded-full"
              >
                <Eye className="h-4 w-4 mr-1" />
                Vista Previa
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="rounded-full">
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
