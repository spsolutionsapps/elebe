'use client'

import { useState, useEffect } from 'react'
import { API_CONFIG } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getImageUrl } from '@/lib/imageUtils'
import { ConfirmModal } from '@/components/ConfirmModal'
import { useModal } from '@/hooks/useModal'

interface Brand {
  id: string
  name: string
  logo: string
  website?: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function BrandsPage() {
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useModal()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logo: null as File | null,
    isActive: true,
  })

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const apiUrl = API_CONFIG.BASE_URL
      const response = await fetch(`${apiUrl}/brands`)
      if (response.ok) {
        const data = await response.json()
        setBrands(data)
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      toast.error('Error al cargar las marcas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const apiUrl = API_CONFIG.BASE_URL
      
      // Si hay un archivo, usar FormData, sino usar JSON
      if (formData.logo) {
        // Usar FormData para subir archivo
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('website', formData.website || '')
        formDataToSend.append('isActive', formData.isActive.toString())
        formDataToSend.append('order', '0')
        formDataToSend.append('logo', formData.logo)

        const url = editingBrand ? `${apiUrl}/brands/${editingBrand.id}` : `${apiUrl}/brands/with-logo`
        const method = editingBrand ? 'PATCH' : 'POST'

        const response = await fetch(url, {
          method,
          body: formDataToSend,
        })

        if (response.ok) {
          toast.success(editingBrand ? 'Marca actualizada' : 'Marca creada')
          fetchBrands()
          resetForm()
        } else {
          const errorData = await response.json()
          console.error('Error al guardar la marca:', errorData)
          toast.error(`Error al guardar la marca: ${errorData.message || response.statusText}`)
        }
      } else {
        // Usar JSON cuando no hay archivo
        const jsonData = {
          name: formData.name,
          website: formData.website || undefined, // Enviar undefined en lugar de string vacío
          isActive: formData.isActive,
          order: 0
        }

        const url = editingBrand ? `${apiUrl}/brands/${editingBrand.id}` : `${apiUrl}/brands`
        const method = editingBrand ? 'PATCH' : 'POST'

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        })

        if (response.ok) {
          toast.success(editingBrand ? 'Marca actualizada' : 'Marca creada')
          fetchBrands()
          resetForm()
        } else {
          const errorData = await response.json()
          console.error('Error al guardar la marca:', errorData)
          toast.error(`Error al guardar la marca: ${errorData.message || response.statusText}`)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al guardar la marca')
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta marca? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger'
    })

    if (!confirmed) return

    try {
      const apiUrl = API_CONFIG.BASE_URL
      const response = await fetch(`${apiUrl}/brands/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Marca eliminada')
        fetchBrands()
      } else {
        toast.error('Error al eliminar la marca')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar la marca')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      website: '',
      logo: null,
      isActive: true,
    })
    setEditingBrand(null)
    setShowForm(false)
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      website: brand.website || '',
      logo: null,
      isActive: brand.isActive,
    })
    setShowForm(true)
  }

  const handleBulkUpload = async (files: FileList) => {
    if (files.length === 0) return

    setBulkUploading(true)

    try {
      const formDataToSend = new FormData()
      Array.from(files).forEach((file) => {
        formDataToSend.append('logos', file)
      })
      formDataToSend.append('isActive', 'true')

      const apiUrl = API_CONFIG.BASE_URL
      const response = await fetch(`${apiUrl}/brands/bulk-upload`, {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message)
        fetchBrands()
      } else {
        const errorData = await response.json()
        toast.error(`Error: ${errorData.message || 'Error al cargar marcas'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar las marcas')
    } finally {
      setBulkUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando marcas...</p>
        </div>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marcas</h1>
          <p className="text-gray-600">Gestiona las marcas que aparecen en el slider</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => document.getElementById('bulk-upload')?.click()}
            variant="outline"
            disabled={bulkUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {bulkUploading ? 'Cargando...' : 'Cargar Múltiples'}
          </Button>
          <input
            id="bulk-upload"
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleBulkUpload(e.target.files)
              }
            }}
          />
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Marca
          </Button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="bg-white shadow-sm">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-white">
              {editingBrand ? 'Editar Marca' : 'Nueva Marca'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre de la marca</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="website">Sitio web (opcional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
                {editingBrand && !formData.logo && (
                  <p className="text-sm text-gray-500 mt-1">
                    Deja vacío para mantener el logo actual
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isActive">Marca activa</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingBrand ? 'Actualizar' : 'Crear'} Marca
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de marcas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id} className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {brand.isActive ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="font-semibold">{brand.name}</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(brand)}
                    className="rounded-full aspect-square h-8 w-8 p-0 flex items-center justify-center"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(brand.id)}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-full aspect-square h-8 w-8 p-0 flex items-center justify-center"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center h-20 bg-gray-50 rounded-lg">
                  {brand.logo ? (
                    <img
                      src={getImageUrl(brand.logo)}
                      alt={brand.name}
                      className="max-h-16 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Sin logo</span>
                  )}
                </div>

                {brand.website && (
                  <div className="text-sm">
                    <span className="text-gray-500">Sitio web:</span>
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      {brand.website}
                    </a>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Orden: {brand.order}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {brands.length === 0 && (
        <Card className="bg-white shadow-sm">
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay marcas registradas</p>
            <p className="text-gray-400 text-sm mt-2">
              Crea tu primera marca para que aparezca en el slider
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
