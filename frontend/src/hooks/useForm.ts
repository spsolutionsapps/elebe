import { useState, useCallback } from 'react'
import { useValidation, ValidationRule } from './useValidation'
import { useApiError } from './useApiError'

export interface FormOptions<T> {
  initialValues: T
  validationRules: Partial<Record<keyof T, ValidationRule>>
  onSubmit: (values: T) => Promise<any>
  onSuccess?: (result: any) => void
  onError?: (error: any) => void
  resetOnSuccess?: boolean
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules,
  onSubmit,
  onSuccess,
  onError,
  resetOnSuccess = true
}: FormOptions<T>) {
  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateForm,
    reset: resetValidation,
    isValid
  } = useValidation(initialValues, validationRules)

  const { executeWithErrorHandling, loading } = useApiError()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    const validation = validateForm()
    if (!validation.isValid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(validationRules).forEach(field => {
        setFieldTouched(field as keyof T)
      })
      return false
    }

    setIsSubmitting(true)

    try {
      const result = await executeWithErrorHandling(async () => {
        return await onSubmit(values)
      }, false) // No mostrar toast automáticamente

      if (result) {
        if (resetOnSuccess) {
          resetValidation()
        }
        onSuccess?.(result)
        return true
      }
      return false
    } catch (error) {
      onError?.(error)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validationRules, validateForm, setFieldTouched, executeWithErrorHandling, onSubmit, onSuccess, onError, resetOnSuccess, resetValidation])

  const handleInputChange = useCallback((field: keyof T, value: any) => {
    setValue(field, value)
    setFieldTouched(field)
  }, [setValue, setFieldTouched])

  const handleInputBlur = useCallback((field: keyof T) => {
    setFieldTouched(field)
  }, [setFieldTouched])

  const reset = useCallback(() => {
    resetValidation()
    setIsSubmitting(false)
  }, [resetValidation])

  return {
    values,
    errors,
    touched,
    loading: loading || isSubmitting,
    isValid,
    handleSubmit,
    handleInputChange,
    handleInputBlur,
    setValue,
    setFieldTouched,
    reset
  }
}

// Hook específico para formularios de productos
export function useProductForm() {
  return useForm({
    initialValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      isActive: 'true'
    },
    validationRules: {
      name: {
        required: true,
        minLength: 3,
        maxLength: 100
      },
      description: {
        required: true,
        minLength: 10,
        maxLength: 500
      },
      price: {
        required: true,
        custom: (value: string) => {
          const numValue = parseFloat(value)
          if (isNaN(numValue) || numValue < 0) {
            return 'El precio debe ser un número válido mayor o igual a 0'
          }
          return null
        }
      },
      category: {
        required: true
      }
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          price: parseFloat(values.price),
          isActive: values.isActive === 'true'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear el producto')
      }

      return await response.json()
    },
    onSuccess: (result) => {
      console.log('Producto creado exitosamente:', result)
    },
    onError: (error) => {
      console.error('Error al crear producto:', error)
    }
  })
}
