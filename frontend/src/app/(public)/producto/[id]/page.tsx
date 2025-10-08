'use client'

import { useState, useEffect, useRef } from 'react'
import { notFound } from 'next/navigation'
import ImageGallery from '@/components/ImageGallery'
import { ProductSpecifications } from '@/components/ProductSpecifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Package, ArrowLeft, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import { AddToCartButton } from '@/components/AddToCartButton'
import apiClient from '@/lib/api-client'

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
  // Especificaciones técnicas
  printingTypes?: string[]
  productHeight?: number | null
  productLength?: number | null
  productWidth?: number | null
  productWeight?: number | null
  packagingHeight?: number | null
  packagingLength?: number | null
  packagingWidth?: number | null
  packagingWeight?: number | null
  unitsPerBox?: number | null
  individualPackaging?: string | null
}

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'detalles' | 'especificaciones'>('detalles')
  const fetchCalled = useRef(false)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      // Evitar llamadas duplicadas en React StrictMode
      if (fetchCalled.current) {
        console.log('⏭️ Frontend: Fetch ya llamado, omitiendo...')
        return
      }
      
      fetchCalled.current = true
      
      try {
        const { id } = await params
        console.log('🔍 Frontend: Fetching product with slug:', id)
        console.log('⏰ Frontend: Timestamp:', new Date().toISOString())
        
        // Usar el slug directamente para buscar el producto
        const response = await apiClient.get(`/products/slug/${id}`)
        console.log('✅ Frontend: Product fetched successfully')
        setProduct(response.data)
      } catch (err: any) {
        console.error('❌ Frontend: Error fetching product:', err)
        if (err.response?.status === 404) {
          notFound()
        } else {
          setError('Error al cargar el producto')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Producto no encontrado'}</p>
          <Link href="/catalogo" className="text-blue-600 hover:underline">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  // Combinar imagen principal con imágenes adicionales
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images || [])
  ]

  return (
    <div className="paddingDesktop82">
     

        <div className="max-w-6xl mx-auto mb-20">

          {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/catalogo" 
            className="inline-flex items-center transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Link>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <ImageGallery 
                images={allImages} 
                productName={product.name} 
              />
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              {/* Product Header */}
              <div>
               
              <p className="text-lg text-gray-300 mb-6">
                  {product.category}
                </p>
               
                <h1 className="text-4xl font-bold text-white mb-3">
                  {product.name}
                </h1>
               
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-700">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab('detalles')}
                    className={`pb-4 px-2 text-lg font-medium transition-colors relative ${
                      activeTab === 'detalles'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Detalles del producto
                    {activeTab === 'detalles' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('especificaciones')}
                    className={`pb-4 px-2 text-lg font-medium transition-colors relative ${
                      activeTab === 'especificaciones'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Especificaciones técnicas
                    {activeTab === 'especificaciones' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="py-6">
                {activeTab === 'detalles' ? (
                  <div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {product.description}
                    </p>
                  </div>
                ) : (
                  <div>
                    <ProductSpecifications product={product} />
                  </div>
                )}
              </div>

              {/* Add to Cart */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      <Minus className="h-4 w-4 text-white" />
                    </button>
                    <span className="mx-4 text-white font-medium min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <div className="flex-1">
                    <AddToCartButton 
                      productId={product.id}
                      productName={product.name}
                      productDescription={product.description}
                      productImage={product.image || undefined}
                      productPrice={0}
                      quantity={quantity}
                      size="lg"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

    

            </div>

 

          </div>
        </div>

     

        {/* Related Products Section 
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Productos Relacionados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Aquí puedes agregar productos relacionado
            <div className="text-center text-gray-500 py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Próximamente más productos</p>
            </div>
          </div>
        </div>s */}
    </div>
  )
}
