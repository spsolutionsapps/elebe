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
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Especificaciones Técnicas</h3>
      
      {/* Tipos de Impresión */}
      {product.printingTypes && product.printingTypes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Tipos de Impresión</h4>
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
          <h4 className="text-sm font-medium mb-2">Dimensiones del Producto</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.productHeight && (
              <div>
                <span>Altura:</span>
                <span className="ml-2 font-medium">{product.productHeight} cm</span>
              </div>
            )}
            {product.productLength && (
              <div>
                <span>Longitud:</span>
                <span className="ml-2 font-medium">{product.productLength} cm</span>
              </div>
            )}
            {product.productWidth && (
              <div>
                <span>Ancho:</span>
                <span className="ml-2 font-medium">{product.productWidth} cm</span>
              </div>
            )}
            {product.productWeight && (
              <div>
                <span>Peso:</span>
                <span className="ml-2 font-medium">{product.productWeight} kg</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dimensiones del Empaque */}
      {(product.packagingHeight || product.packagingLength || product.packagingWidth || product.packagingWeight) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Dimensiones del Empaque</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.packagingHeight && (
              <div>
                <span>Altura:</span>
                <span className="ml-2 font-medium">{product.packagingHeight} cm</span>
              </div>
            )}
            {product.packagingLength && (
              <div>
                <span>Longitud:</span>
                <span className="ml-2 font-medium">{product.packagingLength} cm</span>
              </div>
            )}
            {product.packagingWidth && (
              <div>
                <span>Ancho:</span>
                <span className="ml-2 font-medium">{product.packagingWidth} cm</span>
              </div>
            )}
            {product.packagingWeight && (
              <div>
                <span>Peso:</span>
                <span className="ml-2 font-medium">{product.packagingWeight} kg</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Información Adicional */}
      {(product.unitsPerBox || product.individualPackaging) && (
        <div>
          <h4 className="text-sm font-mediummb-2">Información Adicional</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.unitsPerBox && (
              <div>
                <span>Unidades por Caja:</span>
                <span className="ml-2 font-medium">{product.unitsPerBox}</span>
              </div>
            )}
            {product.individualPackaging && (
              <div>
                <span>Empaque Individual:</span>
                <span className="ml-2 font-medium">{product.individualPackaging}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
