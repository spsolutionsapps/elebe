'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, FileText, Upload, X, Image as ImageIcon } from 'lucide-react'
import MultiImageUpload from '@/components/MultiImageUpload'
import { getImageUrl } from '@/lib/imageUtils'
import { getApiUrl } from '@/lib/config'
import { AlertModal } from '@/components/AlertModal'
import { useModal } from '@/hooks/useModal'

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as string[]
  })
  
  const { alertState, showAlert, hideAlert } = useModal()

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch(getApiUrl('/about'))
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setFormData({
            title: data.title || '',
            content: data.content || '',
            images: Array.isArray(data.images) ? data.images : []
          })
        }
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch(getApiUrl('/about'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showAlert({
          title: 'Éxito',
          message: 'Contenido guardado exitosamente',
          type: 'success'
        })
      } else {
        showAlert({
          title: 'Error',
          message: 'Error al guardar el contenido',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error saving about data:', error)
      showAlert({
        title: 'Error',
        message: 'Error al guardar el contenido',
        type: 'error'
      })
    } finally {
      setSaving(false)
    }
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sección Nosotros</h1>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />

      <Card className="bg-white">
        <CardHeader className="pb-4 bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            Editar Contenido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título de la sección Nosotros"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Contenido
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={12}
                placeholder="Escribe aquí el contenido de la sección Nosotros..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Puedes usar HTML básico para formatear el texto (ej: &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Imágenes de la Sección
              </label>
              <MultiImageUpload
                currentImages={formData.images}
                onImagesChange={(images: string[]) => setFormData({ ...formData, images })}
                maxImages={5}
              />
              <p className="text-sm text-gray-500 mt-1">
                Sube hasta 5 imágenes para la sección Nosotros. Las imágenes se mostrarán en la página pública.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {formData.content && (
        <Card className="bg-white">
          <CardHeader className="pb-4 bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-white">Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h2>{formData.title}</h2>
              <div 
                dangerouslySetInnerHTML={{ __html: formData.content }}
                className="text-gray-700"
              />
              {formData.images && formData.images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Imágenes de la Sección:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={getImageUrl(imageUrl)}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white text-gray-800"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== index)
                              setFormData({ ...formData, images: newImages })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
