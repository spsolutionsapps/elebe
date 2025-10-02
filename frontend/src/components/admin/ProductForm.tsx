'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Select, { SingleValue } from 'react-select'
import MultiImageUpload from '@/components/MultiImageUpload'
import { Product } from '@/types'

// Tipo para las opciones de React Select
type SelectOption = {
  value: string
  label: string
}

interface ProductFormData {
  name: string
  description: string
  category: string
  image: string
  images: string[]
  printingTypes: string[]
  productHeight: string
  productLength: string
  productWidth: string
  productWeight: string
  packagingHeight: string
  packagingLength: string
  packagingWidth: string
  packagingWeight: string
  unitsPerBox: string
  individualPackaging: string
}

interface ProductFormProps {
  formData: ProductFormData
  editingProduct: Product | null
  onFormDataChange: (data: ProductFormData) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  loading?: boolean
  showImages?: boolean
  showDimensions?: boolean
  showAdditionalInfo?: boolean
  showButtons?: boolean
}

export default function ProductForm({
  formData,
  editingProduct,
  onFormDataChange,
  onSubmit,
  onCancel,
  loading = false,
  showImages = true,
  showDimensions = true,
  showAdditionalInfo = true,
  showButtons = true
}: ProductFormProps) {
  
  // Opciones para React Select
  const categoryOptions = [
    { value: 'Oficina', label: 'Oficina' },
    { value: 'Deporte', label: 'Deporte' },
    { value: 'Viajes', label: 'Viajes' },
    { value: 'Moda', label: 'Moda' },
    { value: 'Uniformes', label: 'Uniformes' },
    { value: 'Bebidas', label: 'Bebidas' },
    { value: 'Imprenta', label: 'Imprenta' },
    { value: 'Merch', label: 'Merch' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Bonus', label: 'Bonus' }
  ]

  const packagingOptions = [
    { value: '', label: 'Seleccionar...' },
    { value: 'A granel', label: 'A granel' },
    { value: 'Individual', label: 'Individual' },
    { value: 'Por pares', label: 'Por pares' },
    { value: 'Por docena', label: 'Por docena' }
  ]

  // Estilos personalizados para React Select (flat/minimalista según preferencias)
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

  const handleFieldChange = (field: keyof ProductFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value })
  }

  const handlePrintingTypeChange = (type: string, checked: boolean) => {
    const currentTypes = formData.printingTypes || []
    if (checked) {
      handleFieldChange('printingTypes', [...currentTypes, type])
    } else {
      handleFieldChange('printingTypes', currentTypes.filter(t => t !== type))
    }
  }

  return (
    <Card>
      <CardHeader className="text-black rounded-t-lg">
        <CardTitle className="text-black">
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Categoría
              </label>
              <Select
                value={categoryOptions.find(option => option.value === formData.category)}
                onChange={(selectedOption: SingleValue<SelectOption>) => 
                  handleFieldChange('category', selectedOption?.value || 'Oficina')
                }
                options={categoryOptions}
                styles={customSelectStyles}
                placeholder="Seleccionar categoría..."
                isSearchable={false}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          
          {showImages && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Imágenes del Producto (máximo 6)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                💡 <strong>La primera imagen será la imagen principal</strong> del producto
              </p>
              <MultiImageUpload
                onImagesChange={(images) => {
                  // La primera imagen será la imagen principal
                  handleFieldChange('image', images[0] || '')
                  handleFieldChange('images', images)
                }}
                currentImages={formData.images}
                maxImages={6}
              />
            </div>
          )}

          {/* Especificaciones Técnicas */}
          <div className=" pt-6">
            <h3 className="text-lg font-body font-semibold mb-4">Especificaciones Técnicas</h3>
            
            {/* Tipos de Impresión */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Tipos de Impresión
              </label>
              <div className="space-y-2">
                {['Serigrafía', 'Tampografía', 'Sublimación', 'Vinilo', 'Bordado'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.printingTypes?.includes(type) || false}
                      onChange={(e) => handlePrintingTypeChange(type, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {showDimensions && (
              <>
                {/* Dimensiones del Producto y Empaque en la misma fila */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                  {/* Dimensiones del Producto */}
                  <div>
                    <h4 className="text-md font-medium mb-3">Dimensiones del Producto</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Altura (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.productHeight}
                          onChange={(e) => handleFieldChange('productHeight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Longitud (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.productLength}
                          onChange={(e) => handleFieldChange('productLength', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ancho (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.productWidth}
                          onChange={(e) => handleFieldChange('productWidth', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.productWeight}
                          onChange={(e) => handleFieldChange('productWeight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dimensiones del Empaque */}
                  <div>
                    <h4 className="text-md font-medium mb-3">Dimensiones del Empaque</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Altura (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.packagingHeight}
                          onChange={(e) => handleFieldChange('packagingHeight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Longitud (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.packagingLength}
                          onChange={(e) => handleFieldChange('packagingLength', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ancho (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.packagingWidth}
                          onChange={(e) => handleFieldChange('packagingWidth', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.packagingWeight}
                          onChange={(e) => handleFieldChange('packagingWeight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {showAdditionalInfo && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Unidades por Caja</label>
                  <input
                    type="number"
                    value={formData.unitsPerBox}
                    onChange={(e) => handleFieldChange('unitsPerBox', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Empaque Individual</label>
                  <Select
                    value={packagingOptions.find(option => option.value === formData.individualPackaging)}
                    onChange={(selectedOption: SingleValue<SelectOption>) => 
                      handleFieldChange('individualPackaging', selectedOption?.value || '')
                    }
                    options={packagingOptions}
                    styles={customSelectStyles}
                    placeholder="Seleccionar empaque..."
                    isSearchable={false}
                  />
                </div>
              </div>
            )}
          </div>
          
          {showButtons && (
            <div className="flex gap-2">
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
                    {editingProduct ? 'Actualizando...' : 'Publicando...'}
                  </>
                ) : (
                  editingProduct ? 'Actualizar' : 'Publicar producto'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="rounded-full">
                Cancelar
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
