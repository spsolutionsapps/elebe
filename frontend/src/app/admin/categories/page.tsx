'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  hoverText?: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    hoverText: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCategory
        ? `http://localhost:3001/api/categories/${editingCategory.id}`
        : 'http://localhost:3001/api/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchCategories()
        resetForm()
        setShowModal(false)
      } else {
        const error = await response.json()
        alert(error.message || 'Error al guardar la categoría')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error al guardar la categoría')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image || '',
      hoverText: category.hoverText || '',
      order: category.order,
      isActive: category.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCategories()
      } else {
        alert('Error al eliminar la categoría')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error al eliminar la categoría')
    }
  }

  const resetForm = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      image: '',
      hoverText: '',
      order: 0,
      isActive: true
    })
  }

  const handleNewCategory = () => {
    resetForm()
    setShowModal(true)
  }

  // Generar slug automáticamente desde el nombre
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    })
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categorías del Catálogo</h1>
        <Button onClick={handleNewCategory} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Lista de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category.image && (
                <div className="mb-4">
                  <img
                    src={`http://localhost:3001${category.image}`}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Slug:</strong> {category.slug}</p>
                <p><strong>Orden:</strong> {category.order}</p>
                {category.hoverText && (
                  <p><strong>Texto hover:</strong> {category.hoverText}</p>
                )}
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className={category.isActive ? 'text-green-600' : 'text-red-600'}>
                    {category.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="categoria-ejemplo"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se genera automáticamente desde el nombre. Debe ser único.
                  </p>
                </div>

                <div>
                  <Label>Imagen de Fondo</Label>
                  <ImageUpload
                    onImageUpload={(url) => setFormData({ ...formData, image: url })}
                    currentImage={formData.image}
                  />
                </div>

                <div>
                  <Label htmlFor="hoverText">Texto en Hover</Label>
                  <Textarea
                    id="hoverText"
                    value={formData.hoverText}
                    onChange={(e) => setFormData({ ...formData, hoverText: e.target.value })}
                    placeholder="Texto que aparece al pasar el mouse..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="order">Orden</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Define el orden en que aparece la categoría (menor número = primero)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <Label htmlFor="isActive">Categoría activa</Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

