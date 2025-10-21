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

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  hoverText?: string | null
  order: number
  isActive: boolean
}

function CatalogoContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
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

  const fetchCategories = async () => {
    try {
      const response = await fetch(getApiUrl('/categories'))
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
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
          <div style={{borderRadius: '150px'}} className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300 font-body">Cargando...</p>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent py-12 paddingDesktop62">
      {/* Header con buscador - 100% width */}
      <div className="w-full p-8 mb-12 relative overflow-hidden" style={{ backgroundColor: '#4FBED5' }}>
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-4">
              {searchParam ? `Resultados para: "${searchParam}"` : 
               categoryParam ? `${categoryParam.replaceAll('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}` : 
               'Catálogo de Productos'}
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              {searchParam ? `Encontramos ${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} para tu búsqueda` :
               categoryParam ? `Productos de la categoría ${categoryParam.replaceAll('-', ' ')}` : 
               'Descubre nuestra colección exclusiva de ropa y accesorios de moda'}
            </p>
          </div>


          {/* Buscador */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-lg"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>

          {searchParam && (
            <div className="text-center mt-6">
              <Link 
                href="/catalogo" 
                className="inline-block text-white hover:text-gray-100 underline"
              >
                ← Ver todos los productos
              </Link>
            </div>
          )}

          <div className='shapeCatalogoIzq'>
          <img src="/catalogo-izquierda.svg" alt="shape catalogo izq" />
          </div>

          <div className='shapeCatalogoDer'>
            <img src="/shapeCatalogoDer.svg" alt="ShapeCatalogoDer" />
          </div>


        </div>

      <div className="md:w-[1440px] mx-auto">
        {/* Categories Links - Solo mostrar si no hay búsqueda o categoría seleccionada */}
        {!categoryParam && !searchParam && (
          <div className="mb-8">
            {/* <h2 className="text-2xl font-bold mb-6 text-center">Categorías</h2> */}
            
            {/* Links de categorías */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalogo?category=${category.slug}`}
                  className="px-4 py-2 rounded-full transition-colors hover:opacity-90"
                  style={{ backgroundColor: 'rgb(242, 219, 103)' }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories Grid - Solo mostrar si no hay búsqueda o categoría seleccionada */}
        {!categoryParam && !searchParam && (
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-0 w-full md:w-[1440px] mx-auto">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalogo?category=${category.slug}`}
                  className="group w-full md:w-[288px] h-[300px] md:h-[431px] relative overflow-hidden"
                  title={category.hoverText || category.name}
                >
                  <div 
                    className="w-full h-full transition-all duration-300 group-hover:scale-105 relative"
                    style={{
                      backgroundImage: category.image 
                        ? `url(${getImageUrl(category.image)})`
                        : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Overlay con el nombre de la categoría solo en hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-70 text-white text-[16px] font-medium px-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {category.hoverText || category.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid - Solo mostrar si hay búsqueda o categoría seleccionada */}
        {(categoryParam || searchParam) && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay productos en esta categoría'}
                </p>
                <Link 
                  href="/catalogo" 
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 underline"
                >
                  ← Volver a categorías
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0">
                {filteredProducts.map((product) => {
                  const productSlug = generateSlug(product.name)
                  return (
                    <Link
                      key={product.id}
                      href={`/producto/${productSlug}`}
                      className="group block"
                    >
                      <div className="overflow-hidden">
                        {/* Imagen del producto */}
                        <div className="w-full h-64 bg-transparent">
                          {product.image ? (
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Package className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Barra inferior con nombre del producto */}
                        <div className="space-y-2 mt-4">
                            <h3 className="font-semibold verde text-md line-clamp-2 group-hover:text-blue transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xs sliderCategory verde font-medium">
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
          </>
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
