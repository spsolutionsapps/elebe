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
          {/* Layout responsivo: mobile (columna) / desktop (grid) */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
            
            {/* Sección 1: Título */}
            <div className="order-1 md:order-1">
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

            {/* Sección 2: Texto del Botón */}
            <div className="order-2 md:order-2">
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

            {/* Sección 3: Enlace del Botón */}
            <div className="order-3 md:order-3">
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

            {/* Sección 4: Estilos del Título */}
            <div className="order-4 md:order-4">
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
            </div>

            {/* Sección 5: Estilos del Botón */}
            <div className="order-5 md:order-5">
              <ButtonStyleEditor
                formData={formData}
                onStyleChange={handleStyleChange}
                onReset={handleReset}
                onExample={() => {}}
              />
            </div>

            {/* Sección 6: Imagen */}
            <div className="order-6 md:order-6">
              <label className="block text-sm font-medium mb-1">
                Imagen
              </label>
              <ImageUpload
                key={`image-upload-${editingSlide?.id || 'new'}`}
                onImageUpload={(imageUrl) => onFormDataChange('image', imageUrl)}
                currentImage={formData.image}
              />
            </div>

            {/* Sección 7: Preview */}
            <div className="order-7 md:order-7">
              <label className="block text-sm font-medium mb-1">
                Preview
              </label>
              <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Vista previa del slide</p>
              </div>
            </div>

            {/* Sección 8: Orden del Slide */}
            <div className="order-8 md:order-8">
              <label className="block text-sm font-medium mb-1">
                Orden del Slide en la Home
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => onFormDataChange('order', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            {/* Sección 9: Botones de acción */}
            <div className="order-9 md:order-9 flex flex-col md:flex-row gap-2">
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-full md:w-auto"
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
                className="rounded-full w-full md:w-auto"
              >
                <Eye className="h-4 w-4 mr-1" />
                Vista Previa
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="rounded-full w-full md:w-auto">
                Cancelar
              </Button>
            </div>
          </div>

        </form>
      </CardContent>
    </Card>
  )
}
