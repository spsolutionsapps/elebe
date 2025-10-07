'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { getImageUrl, getApiUrl } from '@/lib/config'
import { useSearchParams } from 'next/navigation'

// Función para generar slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .trim()
}

interface Product {
  id: string
  name: string
  description: string
  category: string
  image?: string | null
  images?: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

function CatalogoContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')

  useEffect(() => {
    fetchProducts()
    // Inicializar searchTerm con el parámetro de URL
    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [searchParam])

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from:', getApiUrl('/products'))
      const response = await fetch(getApiUrl('/products'))
      if (response.ok) {
        const data = await response.json()
        console.log('Products fetched:', data.length, 'products')
        setProducts(data)
      } else {
        console.error('Error response:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (categoryParam) {
      // Mapear parámetros de URL a categorías reales
      const categoryMap: { [key: string]: string } = {
        'oficina': 'Oficina',
        'deporte': 'Deporte',
        'viajes': 'Viajes',
        'moda': 'Moda',
        'uniformes': 'Uniformes',
        'bebidas': 'Bebidas',
        'imprenta': 'Imprenta',
        'merch': 'Merch',
        'tecnologia': 'Tecnología',
        'bonus': 'Bonus'
      }
      
      const mappedCategory = categoryMap[categoryParam] || categoryParam
      const matchesCategory = product.category.toLowerCase() === mappedCategory.toLowerCase()
      
      return matchesSearch && matchesCategory
    }
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent py-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent py-12 paddingDesktop82">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {searchParam ? `Resultados para: "${searchParam}"` : 
             categoryParam ? `Categoría: ${categoryParam.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}` : 
             'Catálogo de Productos'}
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            {searchParam ? `Encontramos ${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} para tu búsqueda` :
             categoryParam ? `Productos de la categoría ${categoryParam.replace('-', ' ')}` : 
             'Descubre nuestra colección exclusiva de ropa y accesorios de moda'}
          </p>
          {(categoryParam || searchParam) && (
            <Link 
              href="/catalogo" 
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              ← Ver todos los productos
            </Link>
          )}
        </div>


        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Pronto tendremos nuevos productos para ti'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
            {filteredProducts.map((product) => {
              const productSlug = generateSlug(product.name)
              return (
                <Link
                  key={product.id}
                  href={`/producto/${productSlug}`}
                  className="group block"
                >
                  <div className="rounded-lg overflow-hidden">
                    {/* Imagen del producto */}
                    <div className="w-full h-64 bg-transparent">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 radius20"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Package className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Barra inferior con nombre del producto */}
                    <div className="bg-black text-white p-3 text-left">
                      <h2 className="text-sm font-medium truncate">
                        {product.name}
                      </h2>
                      <p className="text-xs text-gray-300 mt-1">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Results Count */}
        {searchTerm && (
          <div className="text-center mt-8 text-gray-600">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando catálogo...</p>
          </div>
        </div>
      </div>
    }>
      <CatalogoContent />
    </Suspense>
  )
}
