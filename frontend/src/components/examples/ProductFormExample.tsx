'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CustomSelect from '@/components/ui/select'

// Ejemplo de cómo se vería un formulario de productos con el nuevo estilo
export default function ProductFormExample() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'active',
    priority: 'medium'
  })

  // Opciones para los selects con iconos flat
  const categoryOptions = [
    { value: 'clothing', label: '👕 Ropa' },
    { value: 'accessories', label: '👜 Accesorios' },
    { value: 'shoes', label: '👟 Zapatos' },
    { value: 'jewelry', label: '💍 Joyas' }
  ]

  const statusOptions = [
    { value: 'active', label: '✅ Activo' },
    { value: 'inactive', label: '❌ Inactivo' },
    { value: 'draft', label: '📝 Borrador' }
  ]

  const priorityOptions = [
    { value: 'low', label: '🟢 Baja' },
    { value: 'medium', label: '🟡 Media' },
    { value: 'high', label: '🟠 Alta' },
    { value: 'urgent', label: '🔴 Urgente' }
  ]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📦</span>
          <span>Ejemplo: Formulario de Producto</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Nombre del producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Vestido elegante"
            />
          </div>

          {/* Categoría y Estado en la misma línea */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <CustomSelect
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                placeholder="Seleccionar categoría"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <CustomSelect
                options={statusOptions}
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value })}
                placeholder="Seleccionar estado"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el producto..."
              className="min-h-[100px]"
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <CustomSelect
              options={priorityOptions}
              value={formData.priority}
              onChange={(value) => setFormData({ ...formData, priority: value })}
              placeholder="Seleccionar prioridad"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Guardar Producto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
