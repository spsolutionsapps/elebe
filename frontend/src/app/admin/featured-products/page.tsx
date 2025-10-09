'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Package, Eye, EyeOff } from 'lucide-react'
import { Product } from '@/types'
import { getImageUrl as getImageUrlFromConfig, getApiUrl } from '@/lib/config'
import { useToast } from '@/hooks/useToast'

// Función para obtener la URL de la imagen
function getImageUrl(imagePath: string): string {
  return getImageUrlFromConfig(imagePath);
}

export default function FeaturedProductsPage() {
  const { showSuccess, showError } = useToast()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchFeaturedProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiUrl('/products'))
      const data = await response.json()
      setAllProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setAllProducts([])
    }
  }

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(getApiUrl('/products/featured'))
      const data = await response.json()
      setFeaturedProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching featured products:', error)
      setFeaturedProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addToFeatured = async (productId: string) => {
    try {
      const response = await fetch(getApiUrl(`/products/${productId}/feature`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        showSuccess('Producto agregado a destacados')
        fetchFeaturedProducts()
      } else {
        showError('Error al agregar producto a destacados')
      }
    } catch (error) {
      console.error('Error adding to featured:', error)
      showError('Error al agregar producto a destacados')
    }
  }

  const removeFromFeatured = async (productId: string) => {
    try {
      const response = await fetch(getApiUrl(`/products/${productId}/unfeature`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        showSuccess('Producto removido de destacados')
        fetchFeaturedProducts()
      } else {
        showError('Error al remover producto de destacados')
      }
    } catch (error) {
      console.error('Error removing from featured:', error)
      showError('Error al remover producto de destacados')
    }
  }

  const updateOrder = async (productId: string, newOrder: number) => {
    try {
      const response = await fetch(getApiUrl(`/products/${productId}/feature-order`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
      })

      if (response.ok) {
        showSuccess('Orden actualizado')
        fetchFeaturedProducts()
      } else {
        showError('Error al actualizar orden')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      showError('Error al actualizar orden')
    }
  }

  // Filtrar productos que no están en destacados
  const availableProducts = allProducts.filter(product => 
    !featuredProducts.some(featured => featured.id === product.id)
  )

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
        <div>
          <h1 className="text-2xl font-bold">Productos Más Buscados</h1>
          <p className="text-gray-600">Gestiona los productos que aparecen en el slider del home</p>
        </div>
        <div className="text-sm text-gray-600">
          {featuredProducts.length}/8 productos destacados
        </div>
      </div>

      {/* Productos destacados actuales */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Destacados Actuales</CardTitle>
        </CardHeader>
        <CardContent>
          {featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay productos destacados
              </h3>
              <p className="text-gray-600">
                Agrega productos para que aparezcan en el slider del home.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featuredProducts
                    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
                    .map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrder(product.id, (product.featuredOrder || 0) - 1)}
                            disabled={index === 0}
                            className="h-6 w-6 p-0 rounded-full aspect-square flex items-center justify-center"
                          >
                            ↑
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {product.featuredOrder || index + 1}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrder(product.id, (product.featuredOrder || 0) + 1)}
                            disabled={index === featuredProducts.length - 1}
                            className="h-6 w-6 p-0 rounded-full aspect-square flex items-center justify-center"
                          >
                            ↓
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-contain rounded-md"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{product.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromFeatured(product.id)}
                          className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-full"
                        >
                          <Trash2 className="h-4 w-4 mr-1 text-white" />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Productos disponibles para agregar */}
      {availableProducts.length > 0 && featuredProducts.length <= 8 && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Productos Destacados</CardTitle>
            <p className="text-sm text-gray-600">
              Selecciona productos para agregar al slider (máximo 8 productos)
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableProducts.slice(0, 12).map((product) => (
                <Card key={product.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-contain rounded-md"
                        />
                      ) : (
                        <Package className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <p className="text-xs text-blue-600 font-medium">{product.category}</p>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => addToFeatured(product.id)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                      style={{
                        backgroundColor: '#2563eb',
                        borderColor: '#2563eb'
                      }}
                      disabled={featuredProducts.length >= 8}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar a Destacados
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {featuredProducts.length >= 8 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Máximo de productos alcanzado
            </h3>
            <p className="text-gray-600">
              Ya tienes 8 productos destacados. Remueve uno para agregar otro.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
