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

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
}

export default function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: ProductCardProps) {
  return (
    <Card className={`bg-white shadow-sm border transition-opacity ${!product.isActive ? 'opacity-50' : ''}`}>
      <CardContent className="p-4 bg-white">
        <div className="aspect-video bg-transparent rounded-md mb-4 flex items-center justify-center relative">
          {product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name || 'Producto'}
              className="w-full h-full object-contain rounded-md"
            />
          ) : (
            <Package className="h-12 w-12 text-gray-400" />
          )}
          
          {/* Indicador de estado */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            product.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.isActive ? 'Activo' : 'Inactivo'}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">{product.name || 'Sin nombre'}</h3>
          <p className="text-xs text-blue-600 font-medium">
            {Array.isArray(product.category) 
              ? (product.category.length > 0 ? product.category.join(', ') : 'Sin categoría')
              : (product.category || 'Sin categoría')}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description || 'Sin descripción'}
          </p>
          <p className="text-xs text-purple-600 font-medium">
            👁️ {product.views || 0} vistas
          </p>
        </div>
        
        <div className="flex gap-1 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleStatus(product.id, product.isActive)}
            title={product.isActive ? "Ocultar producto" : "Mostrar producto"}
            className={`${
              product.isActive 
                ? 'text-orange-600 border-orange-600 hover:bg-orange-50' 
                : 'text-green-600 border-green-600 hover:bg-green-50'
            } w-8 h-8 p-0 rounded-full`}
          >
            {product.isActive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
            title="Editar producto"
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 w-8 h-8 p-0 rounded-full"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(product)}
            title="Eliminar producto"
            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 w-8 h-8 p-0 rounded-full"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
