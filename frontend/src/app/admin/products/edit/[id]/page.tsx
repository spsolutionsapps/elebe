'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import ProductForm from '@/components/admin/ProductForm'
import MultiImageUpload from '@/components/MultiImageUpload'
import Select, { SingleValue } from 'react-select'
import { Product } from '@/types'
import { getApiUrl } from '@/lib/config'
import { AlertModal } from '@/components/AlertModal'
import { useModal } from '@/hooks/useModal'

// Tipo para las opciones de React Select
type SelectOption = {
  value: string
  label: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const { alertState, showAlert, hideAlert } = useModal()
  
  // Opciones para React Select
  const packagingOptions = [
    { value: '', label: 'Seleccionar...' },
    { value: 'A granel', label: 'A granel' },
    { value: 'Individual', label: 'Individual' },
    { value: 'Por pares', label: 'Por pares' },
    { value: 'Por docena', label: 'Por docena' }
  ]

  // Estilos personalizados para React Select
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: '#d1d5db',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9ca3af'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#2563eb' : '#f3f4f6'
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#374151'
    })
  }
  const [loadingProduct, setLoadingProduct] = useState(true)
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Oficina',
    image: '',
    images: [] as string[],
    printingTypes: [] as string[],
    productHeight: '',
    productLength: '',
    productWidth: '',
    productWeight: '',
    packagingHeight: '',
    packagingLength: '',
    packagingWidth: '',
    packagingWeight: '',
    unitsPerBox: '',
    individualPackaging: ''
  })

  // Cargar producto al montar
  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoadingProduct(true)
      const response = await fetch(getApiUrl(`/products/${productId}`))
      
      if (response.ok) {
        const productData = await response.json()
        setProduct(productData)
        
        // Configurar formulario con datos del producto
        const allImages = [
          ...(productData.image ? [productData.image] : []),
          ...(productData.images || [])
        ]
        
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          category: productData.category || 'Oficina',
          image: productData.image || '',
          images: allImages,
          printingTypes: productData.printingTypes || [],
          productHeight: productData.productHeight?.toString() || '',
          productLength: productData.productLength?.toString() || '',
          productWidth: productData.productWidth?.toString() || '',
          productWeight: productData.productWeight?.toString() || '',
          packagingHeight: productData.packagingHeight?.toString() || '',
          packagingLength: productData.packagingLength?.toString() || '',
          packagingWidth: productData.packagingWidth?.toString() || '',
          packagingWeight: productData.packagingWeight?.toString() || '',
          unitsPerBox: productData.unitsPerBox?.toString() || '',
          individualPackaging: productData.individualPackaging || ''
        })
      } else {
        console.error('Error fetching product')
        showAlert({
          title: 'Error',
          message: 'Error al cargar el producto',
          type: 'error'
        })
        setTimeout(() => {
          router.push('/admin/products')
        }, 1500)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      showAlert({
        title: 'Error',
        message: 'Error al cargar el producto',
        type: 'error'
      })
      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } finally {
      setLoadingProduct(false)
    }
  }

  const handleFormDataChange = (data: typeof formData) => {
    setFormData(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Frontend: Form submitted for editing product:', productId)
    console.log('📝 Frontend: Form data:', formData)
    setLoading(true)
    
    try {
      // Separar la primera imagen como imagen principal y el resto como imágenes adicionales
      const [mainImage, ...additionalImages] = formData.images
      console.log('🖼️ Frontend: Main image:', mainImage)
      console.log('🖼️ Frontend: Additional images:', additionalImages)
      
      const productData = {
        ...formData,
        image: mainImage || '',
        images: additionalImages,
        isActive: product?.isActive ?? true
      }
      console.log('📦 Frontend: Product data to send:', productData)
      
      console.log('🌐 Frontend: Making PUT request to', getApiUrl(`/products/${productId}`))
      const response = await fetch(getApiUrl(`/products/${productId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      console.log('📡 Frontend: Response status:', response.status)
      console.log('📡 Frontend: Response ok:', response.ok)

      if (response.ok) {
        const updatedProduct = await response.json()
        console.log('✅ Frontend: Product updated successfully:', updatedProduct)
        showAlert({
          title: 'Éxito',
          message: '¡Producto actualizado exitosamente!',
          type: 'success'
        })
        // Redirigir a la lista de productos
        setTimeout(() => {
          router.push('/admin/products')
        }, 1500)
      } else {
        const errorData = await response.json()
        console.error('❌ Frontend: Error response:', errorData)
        showAlert({
          title: 'Error',
          message: errorData.error || 'Error al actualizar el producto',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('❌ Frontend: Error updating product:', error)
      showAlert({
        title: 'Error',
        message: `Error al actualizar el producto: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        type: 'error'
      })
    } finally {
      setLoading(false)
      console.log('🔄 Frontend: Loading set to false')
    }
  }

  const handleCancel = () => {
    router.push('/admin/products')
  }

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Producto no encontrado</h1>
          <Button onClick={handleCancel} className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Productos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />

      {/* Header con botón de regreso y título */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex items-center gap-2 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-black">Editar Producto</h1>
          <p className="text-gray-600 mt-1">
            Modifica la información del producto: <strong>{product.name}</strong>
          </p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">

      {/* DIV 1: Formulario Básico + Imágenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Izquierda - Formulario Básico */}
        <div className="space-y-6">
          <ProductForm
            formData={formData}
            editingProduct={product}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            showImages={false}
            showDimensions={false}
            showAdditionalInfo={false}
            showButtons={false}
          />
        </div>

        {/* Columna Derecha - Subida de Imágenes */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Imágenes del Producto</CardTitle>
              <p className="text-sm text-gray-600">
                Sube hasta 6 imágenes. La primera será la imagen principal.
              </p>
            </CardHeader>
            <CardContent>
              <MultiImageUpload
                onImagesChange={(images) => {
                  // La primera imagen será la imagen principal
                  handleFormDataChange({ 
                    ...formData, 
                    image: images[0] || '', 
                    images: images 
                  })
                }}
                currentImages={formData.images}
                maxImages={6}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DIV 2: Dimensiones del Producto y Empaque */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Columna Izquierda - Dimensiones del Producto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Dimensiones del Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Altura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.productHeight}
                  onChange={(e) => handleFormDataChange({ ...formData, productHeight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitud (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.productLength}
                  onChange={(e) => handleFormDataChange({ ...formData, productLength: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ancho (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.productWidth}
                  onChange={(e) => handleFormDataChange({ ...formData, productWidth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.productWeight}
                  onChange={(e) => handleFormDataChange({ ...formData, productWeight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Columna Derecha - Dimensiones del Empaque */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Dimensiones del Empaque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Altura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.packagingHeight}
                  onChange={(e) => handleFormDataChange({ ...formData, packagingHeight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitud (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.packagingLength}
                  onChange={(e) => handleFormDataChange({ ...formData, packagingLength: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ancho (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.packagingWidth}
                  onChange={(e) => handleFormDataChange({ ...formData, packagingWidth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.packagingWeight}
                  onChange={(e) => handleFormDataChange({ ...formData, packagingWeight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DIV 3: Información Adicional (Ancho Completo) */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Información Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Unidades por Caja</label>
              <input
                type="number"
                value={formData.unitsPerBox}
                onChange={(e) => handleFormDataChange({ ...formData, unitsPerBox: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Empaque Individual</label>
              <Select
                value={packagingOptions.find(option => option.value === formData.individualPackaging)}
                onChange={(selectedOption: SingleValue<SelectOption>) => 
                  handleFormDataChange({ ...formData, individualPackaging: selectedOption?.value || '' })
                }
                options={packagingOptions}
                styles={customSelectStyles}
                placeholder="Seleccionar empaque..."
                isSearchable={false}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-2 justify-end">
        <Button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          style={{
            backgroundColor: '#2563eb',
            borderColor: '#2563eb'
          }}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Actualizando...
            </>
          ) : (
            'Actualizar'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel} className="rounded-full">
          Cancelar
        </Button>
      </div>

      </form>
    </div>
  )
}
