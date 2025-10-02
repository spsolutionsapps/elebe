'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Plus, 
  Trash2, 
  Package, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react'
import { Product } from '@/types'

// Componentes refactorizados
import ProductStats from '@/components/admin/ProductStats'
import ProductFilters from '@/components/admin/ProductFilters'
import ProductCard from '@/components/admin/ProductCard'
import ProductTable from '@/components/admin/ProductTable'
import { useProducts } from '@/hooks/useProducts'

export default function ProductsPage() {
  const router = useRouter()
  
  const {
    // Estados
    products,
    loading,
    showDeleteModal,
    productToDelete,
    searchTerm,
    selectedCategory,
    statusFilter,
    viewMode,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    
    // Datos procesados
    filteredAndSortedProducts,
    paginatedProducts,
    stats,
    categories,
    totalPages,
    
    // Setters
    setShowDeleteModal,
    setProductToDelete,
    setSearchTerm,
    setSelectedCategory,
    setStatusFilter,
    setViewMode,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    
    // Operaciones
    fetchProducts,
    handleDelete,
    confirmDelete,
    toggleProductStatus,
    clearFilters,
    handleSort
  } = useProducts()

  // Handlers para filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleViewModeChange = (mode: 'grid' | 'table') => {
    setViewMode(mode)
  }

  const handleSortChange = (field: 'name' | 'category' | 'createdAt' | 'views', order: 'asc' | 'desc') => {
    setSortBy(field)
    setSortOrder(order)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    clearFilters()
  }

  // Handlers para navegación
  const handleNewProduct = () => {
    router.push('/admin/products/new')
  }

  const handleEditProduct = (product: Product) => {
    router.push(`/admin/products/edit/${product.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedProducts.length} de {stats.total} productos
          </p>
        </div>
        <Button 
          onClick={handleNewProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          style={{
            backgroundColor: '#2563eb',
            borderColor: '#2563eb'
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Estadísticas */}
      <ProductStats
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
        categoriesCount={categories.length}
        totalViews={products.reduce((sum, product) => sum + (product.views || 0), 0)}
      />

      {/* Filtros */}
      <ProductFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        statusFilter={statusFilter}
        viewMode={viewMode}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onViewModeChange={handleViewModeChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        categories={categories}
        hasActiveFilters={!!(searchTerm || selectedCategory || statusFilter !== 'all')}
      />


      {/* Vista de Productos */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDelete}
              onToggleStatus={toggleProductStatus}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={paginatedProducts}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onEdit={handleEditProduct}
          onDelete={handleDelete}
          onToggleStatus={toggleProductStatus}
          onSort={handleSort}
        />
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} de {filteredAndSortedProducts.length} productos
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`rounded-full ${currentPage === pageNumber ? "bg-blue-600 text-white" : ""}`}
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center rounded-full"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estados vacíos */}
      {Array.isArray(products) && products.length === 0 && (
        <Card className="bg-white shadow-sm border">
          <CardContent className="p-8 text-center bg-white">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay productos
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza creando tu primer producto para el catálogo.
            </p>
            <Button 
              onClick={handleNewProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              style={{
                backgroundColor: '#2563eb',
                borderColor: '#2563eb'
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear primer producto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mensaje cuando no hay productos filtrados */}
      {Array.isArray(products) && products.length > 0 && filteredAndSortedProducts.length === 0 && (
        <Card className="bg-white shadow-sm border">
          <CardContent className="p-8 text-center bg-white">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-4">
              No hay productos que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleClearFilters}
                variant="outline"
                className="text-gray-600 hover:text-gray-800 rounded-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
              <Button 
                onClick={handleNewProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                style={{
                  backgroundColor: '#2563eb',
                  borderColor: '#2563eb'
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear producto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{marginTop: '-20px'}}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿Eliminar producto?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que quieres eliminar el producto <strong>"{productToDelete.name}"</strong>? 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex space-x-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setProductToDelete(null)
                  }}
                  className="px-6 rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-full"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}