'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { Plus, Edit, Trash2, Package, Eye, EyeOff, Search } from 'lucide-react'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

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

  // Filtrar productos por término de búsqueda
  const filteredProducts = availableProducts.filter(product => {
    const productCategories = Array.isArray(product.category) 
      ? product.category 
      : (product.category ? [product.category] : [])
    const matchesCategory = productCategories.some(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matchesCategory ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Resetear a la primera página cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Debug: verificar valores
  useEffect(() => {
    console.log('🔍 Debug Featured Products:', {
      allProducts: allProducts.length,
      featuredProducts: featuredProducts.length,
      availableProducts: availableProducts.length,
      filteredProducts: filteredProducts.length,
      searchTerm,
      currentPage,
      itemsPerPage,
      totalPages
    })
  }, [allProducts.length, featuredProducts.length, availableProducts.length, filteredProducts.length, searchTerm, currentPage, itemsPerPage, totalPages])

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
                          {Array.isArray(product.category) ? product.category.join(', ') : product.category}
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

      {/* Productos disponibles para agregar - SIEMPRE MOSTRAR */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Productos Destacados</CardTitle>
          <p className="text-sm text-gray-600">
            Selecciona productos para agregar al slider (máximo 8 productos)
            {featuredProducts.length >= 8 && (
              <span className="text-red-600 font-semibold ml-2">- Límite alcanzado</span>
            )}
          </p>
        </CardHeader>
        <CardContent>
          {/* Buscador - SIEMPRE VISIBLE */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos por nombre, categoría o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              {searchTerm ? (
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

            {/* Grid de productos */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'No hay productos disponibles para agregar.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedProducts.map((product) => (
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
                      <p className="text-xs text-blue-600 font-medium">
                        {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                      </p>
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

                {/* Paginación - Mostrar siempre si hay productos */}
                {filteredProducts.length > 0 && (
                  <div className="mt-6">
                    {filteredProducts.length > itemsPerPage ? (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredProducts.length}
                        showInfo={true}
                        showItemsPerPage={true}
                        itemsPerPageOptions={[6, 12, 24, 48]}
                        onItemsPerPageChange={(value) => {
                          setItemsPerPage(value)
                          setCurrentPage(1)
                        }}
                      />
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                          Mostrando todos los {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Mostrar:</span>
                          <select
                            value={itemsPerPage}
                            onChange={(e) => {
                              setItemsPerPage(Number(e.target.value))
                              setCurrentPage(1)
                            }}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                          </select>
                          <span className="text-sm text-gray-600">por página</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
