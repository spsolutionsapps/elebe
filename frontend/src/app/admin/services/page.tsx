'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Settings } from 'lucide-react'
import { Service } from '@/types'
import ImageUpload from '@/components/ImageUpload'
import { getImageUrl } from '@/lib/imageUtils'
import { getApiUrl } from '@/lib/config'
import { ConfirmModal } from '@/components/ConfirmModal'
import { useModal } from '@/hooks/useModal'

export default function ServicesPage() {
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useModal()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch(getApiUrl('/services/admin'))
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingService 
        ? getApiUrl(`/services/${editingService.id}`)
        : getApiUrl('/services')
      
      const method = editingService ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingService(null)
        setFormData({ title: '', description: '', image: '', order: 0, isActive: true })
        fetchServices()
      }
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title || '',
      description: service.description || '',
      image: service.image || '',
      order: service.order || 0,
      isActive: service.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger'
    })

    if (!confirmed) return

    try {
      const response = await fetch(getApiUrl(`/services/${id}`), {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchServices()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingService(null)
    setFormData({ title: '', description: '', image: '', order: 0, isActive: true })
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
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Servicios</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-white">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
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
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Activo
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Imagen (opcional)
                </label>
                <ImageUpload
                  onImageUpload={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                  currentImage={formData.image}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingService ? 'Actualizar' : 'Crear'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="bg-white">
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                {service.image ? (
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.title || 'Servicio'}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <Settings className="h-12 w-12 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{service.title || 'Sin título'}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {service.description || 'Sin descripción'}
                </p>
                <p className="text-xs text-gray-500">
                  Orden: {service.order}
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(service)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1 text-white" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !showForm && (
        <Card className="bg-white">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay servicios
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza creando tu primer servicio.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear primer servicio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
