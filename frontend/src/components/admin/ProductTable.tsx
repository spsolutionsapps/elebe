'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2, Package, Eye, EyeOff } from 'lucide-react'
import { Product } from '@/types'
import { getImageUrl as getImageUrlFromConfig } from '@/lib/config'

// Función para obtener la URL de la imagen
function getImageUrl(imagePath: string): string {
  return getImageUrlFromConfig(imagePath)
}

interface ProductTableProps {
  products: Product[]
  sortBy: 'name' | 'category' | 'createdAt' | 'views'
  sortOrder: 'asc' | 'desc'
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
  onSort: (field: 'name' | 'category' | 'createdAt' | 'views') => void
}

export default function ProductTable({
  products,
  sortBy,
  sortOrder,
  onEdit,
  onDelete,
  onToggleStatus,
  onSort
}: ProductTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort('category')}
                >
                  Categoría {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort('createdAt')}
                >
                  Fecha {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort('views')}
                >
                  Vistas {sortBy === 'views' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {product.image ? (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.description || 'Sin descripción'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {product.category || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleStatus(product.id, product.isActive)}
                        title={product.isActive ? "Ocultar producto" : "Mostrar producto"}
                        className={`inline-flex items-center justify-center w-8 h-6 text-xs font-medium rounded-full transition-colors ${
                          product.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {product.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </button>
                      <span className="text-xs text-gray-500">
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs text-purple-600 font-medium">
                      👁️ {product.views || 0}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(product)}
                        title="Editar producto"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50 w-8 h-8 p-0 rounded-full"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(product)}
                        title="Eliminar producto"
                        className="text-red-600 border-red-600 hover:bg-red-50 w-8 h-8 p-0 rounded-full"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
