'use client'

import React from 'react'
import { useValidation, validationRules } from '@/hooks/useValidation'
import { useApiError } from '@/hooks/useApiError'
import { FormField, Input, Textarea, Select } from '@/components/ui/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { API_CONFIG } from '@/lib/config'

interface ProductFormData {
  name: string
  description: string
  price: string
  category: string
  isActive: string
}

const initialValues: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: '',
  isActive: 'true'
}

const validationRulesConfig = {
  name: {
    ...validationRules.required('El nombre del producto es requerido'),
    ...validationRules.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
    ...validationRules.maxLength(100, 'El nombre no puede tener más de 100 caracteres')
  },
  description: {
    ...validationRules.required('La descripción es requerida'),
    ...validationRules.minLength(10, 'La descripción debe tener al menos 10 caracteres'),
    ...validationRules.maxLength(500, 'La descripción no puede tener más de 500 caracteres')
  },
  price: {
    ...validationRules.required('El precio es requerido'),
    custom: (value: string) => {
      const numValue = parseFloat(value)
      if (isNaN(numValue) || numValue < 0) {
        return 'El precio debe ser un número válido mayor o igual a 0'
      }
      return null
    }
  },
  category: {
    ...validationRules.required('La categoría es requerida')
  }
}

const categoryOptions = [
  { value: 'ropa', label: 'Ropa' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'calzado', label: 'Calzado' },
  { value: 'otros', label: 'Otros' }
]

const statusOptions = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' }
]

export default function ProductFormWithValidation() {
  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateForm,
    reset,
    isValid
  } = useValidation(initialValues, validationRulesConfig)

  const { executeWithErrorHandling, loading } = useApiError()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateForm()
    if (!validation.isValid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(validationRulesConfig).forEach(field => {
        setFieldTouched(field as keyof ProductFormData)
      })
      return
    }

    const productData = {
      ...values,
      price: parseFloat(values.price),
      isActive: values.isActive === 'true'
    }

    await executeWithErrorHandling(async () => {
      const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear el producto')
      }

      const result = await response.json()
      console.log('Producto creado:', result)
      
      // Reset form on success
      reset()
      
      return result
    })
  }

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setValue(field, value)
    setFieldTouched(field)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Formulario de Producto con Validación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Nombre del Producto"
            error={errors.name}
            touched={touched.name}
            required
          >
            <Input
              value={values.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => setFieldTouched('name')}
              placeholder="Ingresa el nombre del producto"
              error={errors.name}
              touched={touched.name}
            />
          </FormField>

          <FormField
            label="Descripción"
            error={errors.description}
            touched={touched.description}
            required
          >
            <Textarea
              value={values.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => setFieldTouched('description')}
              placeholder="Describe el producto"
              rows={4}
              error={errors.description}
              touched={touched.description}
            />
          </FormField>

          <FormField
            label="Precio"
            error={errors.price}
            touched={touched.price}
            required
          >
            <Input
              type="number"
              step="0.01"
              min="0"
              value={values.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              onBlur={() => setFieldTouched('price')}
              placeholder="0.00"
              error={errors.price}
              touched={touched.price}
            />
          </FormField>

          <FormField
            label="Categoría"
            error={errors.category}
            touched={touched.category}
            required
          >
            <Select
              value={values.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              onBlur={() => setFieldTouched('category')}
              options={categoryOptions}
              error={errors.category}
              touched={touched.category}
            />
          </FormField>

          <FormField
            label="Estado"
            error={errors.isActive}
            touched={touched.isActive}
          >
            <Select
              value={values.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.value)}
              onBlur={() => setFieldTouched('isActive')}
              options={statusOptions}
              error={errors.isActive}
              touched={touched.isActive}
            />
          </FormField>

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={loading || !isValid}
              className="flex-1"
            >
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
