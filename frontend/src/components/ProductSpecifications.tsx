'use client'

import { Product } from '@/types'

interface ProductSpecificationsProps {
  product: Product
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  // Verificar que el producto existe
  if (!product) {
    return null
  }

  // Verificar si el producto tiene especificaciones técnicas
  const hasSpecifications = 
    (product.printingTypes && product.printingTypes.length > 0) ||
    product.productHeight ||
    product.productLength ||
    product.productWidth ||
    product.productWeight ||
    product.packagingHeight ||
    product.packagingLength ||
    product.packagingWidth ||
    product.packagingWeight ||
    product.unitsPerBox ||
    product.individualPackaging

  if (!hasSpecifications) {
    return null
  }

  return (
    <div className="p-6 mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">Especificaciones Técnicas</h3>
      
      {/* Tipos de Impresión */}
      {product.printingTypes && product.printingTypes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Tipos de Impresión</h4>
          <div className="flex flex-wrap gap-2">
            {product.printingTypes.map((type, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dimensiones del Producto */}
      {(product.productHeight || product.productLength || product.productWidth || product.productWeight) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Dimensiones del Producto</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.productHeight && (
              <div>
                <span className="text-white">Altura:</span>
                <span className="ml-2 font-medium text-white">{product.productHeight} cm</span>
              </div>
            )}
            {product.productLength && (
              <div>
                <span className="text-white">Longitud:</span>
                <span className="ml-2 font-medium text-white">{product.productLength} cm</span>
              </div>
            )}
            {product.productWidth && (
              <div>
                <span className="text-white">Ancho:</span>
                <span className="ml-2 font-medium text-white">{product.productWidth} cm</span>
              </div>
            )}
            {product.productWeight && (
              <div>
                <span className="text-white">Peso:</span>
                <span className="ml-2 font-medium text-white">{product.productWeight} kg</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dimensiones del Empaque */}
      {(product.packagingHeight || product.packagingLength || product.packagingWidth || product.packagingWeight) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Dimensiones del Empaque</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.packagingHeight && (
              <div>
                <span className="text-white">Altura:</span>
                <span className="ml-2 font-medium text-white">{product.packagingHeight} cm</span>
              </div>
            )}
            {product.packagingLength && (
              <div>
                <span className="text-white">Longitud:</span>
                <span className="ml-2 font-medium text-white">{product.packagingLength} cm</span>
              </div>
            )}
            {product.packagingWidth && (
              <div>
                <span className="text-white">Ancho:</span>
                <span className="ml-2 font-medium text-white">{product.packagingWidth} cm</span>
              </div>
            )}
            {product.packagingWeight && (
              <div>
                <span className="text-white">Peso:</span>
                <span className="ml-2 font-medium text-white">{product.packagingWeight} kg</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Información Adicional */}
      {(product.unitsPerBox || product.individualPackaging) && (
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Información Adicional</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.unitsPerBox && (
              <div>
                <span className="text-white">Unidades por Caja:</span>
                <span className="ml-2 font-medium text-white">{product.unitsPerBox}</span>
              </div>
            )}
            {product.individualPackaging && (
              <div>
                <span className="text-white">Empaque Individual:</span>
                <span className="ml-2 font-medium text-white">{product.individualPackaging}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
