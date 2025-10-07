'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Slide } from '@/types'
import ImageUpload from '@/components/ImageUpload'

import { getImageUrl as getImageUrlFromConfig } from '@/lib/config';

// Función para obtener la URL de la imagen
function getImageUrl(imagePath: string): string {
  return getImageUrlFromConfig(imagePath);
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    buttonText: '',
    buttonLink: '',
    image: '',
    order: 1
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      console.log('🔄 Frontend: Fetching slides...')
      const response = await fetch(`http://localhost:3001/api/slides`)
      console.log('📡 Frontend: Response status:', response.status)
      
      const data = await response.json()
      console.log('📊 Frontend: Slides data:', data)
      
      setSlides(Array.isArray(data) ? data : [])
      console.log('✅ Frontend: Slides updated in state')
    } catch (error) {
      console.error('❌ Frontend: Error fetching slides:', error)
      setSlides([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Frontend: Form submitted')
    console.log('📝 Frontend: Form data:', formData)
    console.log('✏️ Frontend: Editing slide:', editingSlide ? editingSlide.id : 'New slide')
    
    try {
      const url = editingSlide 
        ? `http://localhost:3001/api/slides/${editingSlide.id}` 
        : `http://localhost:3001/api/slides`
      
      const method = editingSlide ? 'PUT' : 'POST'
      
      console.log('🌐 Frontend: Making request to:', url)
      console.log('🔧 Frontend: Method:', method)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('📡 Frontend: Response status:', response.status)
      console.log('📡 Frontend: Response ok:', response.ok)

      if (response.ok) {
        console.log('✅ Frontend: Slide saved successfully')
        setShowForm(false)
        setEditingSlide(null)
        setFormData({ title: '', buttonText: '', buttonLink: '', image: '', order: 1 })
        console.log('🔄 Frontend: Refreshing slides list...')
        fetchSlides()
      } else {
        console.error('❌ Frontend: Error response:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('❌ Frontend: Error details:', errorText)
      }
    } catch (error) {
      console.error('❌ Frontend: Error saving slide:', error)
    }
  }

  const handleEdit = (slide: Slide) => {
    console.log('✏️ Frontend: Edit button clicked for slide:', slide.id)
    console.log('📝 Frontend: Slide data:', slide)
    
    setEditingSlide(slide)
    setFormData({
      title: slide.title || '',
      buttonText: slide.buttonText || '',
      buttonLink: slide.buttonLink || '',
      image: slide.image || '',
      order: slide.order || 1
    })
    setShowForm(true)
    console.log('✅ Frontend: Edit form opened')
  }

  const handleDelete = async (id: string) => {
    console.log('🗑️ Frontend: Delete button clicked for slide:', id)
    
    if (!confirm('¿Estás seguro de que quieres eliminar este slide?')) {
      console.log('❌ Frontend: Delete cancelled by user')
      return
    }

    console.log('✅ Frontend: Delete confirmed by user')

    try {
      const url = `http://localhost:3001/api/slides/${id}`
      console.log('🌐 Frontend: Making DELETE request to:', url)
      
      const response = await fetch(url, {
        method: 'DELETE',
      })

      console.log('📡 Frontend: DELETE response status:', response.status)
      console.log('📡 Frontend: DELETE response ok:', response.ok)

      if (response.ok) {
        console.log('✅ Frontend: Slide deleted successfully')
        console.log('🔄 Frontend: Refreshing slides list...')
        fetchSlides()
      } else {
        console.error('❌ Frontend: DELETE error response:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('❌ Frontend: DELETE error details:', errorText)
      }
    } catch (error) {
      console.error('❌ Frontend: Error deleting slide:', error)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingSlide(null)
    setFormData({ title: '', buttonText: '', buttonLink: '', image: '', order: 1 })
  }

  const handleNewSlide = () => {
    console.log('➕ Frontend: New slide button clicked')
    setFormData({ title: '', buttonText: '', buttonLink: '', image: '', order: 1 })
    setEditingSlide(null)
    setShowForm(true)
    console.log('✅ Frontend: New slide form opened')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader style={{ paddingTop: '20px' }}>
          <div className="flex justify-between items-center p20">
            <CardTitle className="text-2xl font-bold">Gestión de Slides</CardTitle>
            <Button 
              onClick={handleNewSlide}
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

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-black">
              {editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ver Productos"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enlace del Botón
                </label>
                <input
                  type="url"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: /catalogo o https://ejemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Imagen
                </label>
                <ImageUpload
                  key={`image-upload-${editingSlide?.id || 'new'}`}
                  onImageUpload={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                  currentImage={formData.image}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {editingSlide ? 'Actualizar' : 'Crear'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-full">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slides.map((slide) => (
          <Card key={slide.id} className="bg-white">
            <CardContent className="p-4">
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
                <p className="text-sm text-gray-600 line-clamp-2">
                  {slide.description || 'Sin descripción'}
                </p>
                <p className="text-xs text-gray-500">Orden: {slide.order}</p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(slide)}
                  className="rounded-full"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(slide.id)}
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-full"
                >
                  <Trash2 className="h-4 w-4 mr-1 text-white" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>

          {slides.length === 0 && !showForm && (
            <div className="p-8 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay slides
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando tu primer slide para el home.
              </p>
              <Button 
                onClick={handleNewSlide}
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
    </div>
  )
}
