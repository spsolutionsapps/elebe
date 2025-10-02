import { useState, useCallback } from 'react'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationErrors {
  [key: string]: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationErrors
}

export function useValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: Partial<Record<keyof T, ValidationRule>>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = useCallback((field: keyof T, value: any): string | null => {
    const rule = rules[field]
    if (!rule) return null

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'Este campo es requerido'
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `Debe tener al menos ${rule.minLength} caracteres`
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `No puede tener más de ${rule.maxLength} caracteres`
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return 'Formato inválido'
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value)
    }

    return null
  }, [rules])

  const validateForm = useCallback((): ValidationResult => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(rules).forEach((field) => {
      const error = validateField(field as keyof T, values[field as keyof T])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return { isValid, errors: newErrors }
  }, [values, rules, validateField])

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
    }
  }, [errors])

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}

// Validation rules helpers
export const validationRules = {
  required: (message?: string): ValidationRule => ({
    required: true,
    custom: (value) => (!value || (typeof value === 'string' && value.trim() === '')) 
      ? (message || 'Este campo es requerido') 
      : null
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    minLength: min,
    custom: (value) => (typeof value === 'string' && value.length < min)
      ? (message || `Debe tener al menos ${min} caracteres`)
      : null
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    maxLength: max,
    custom: (value) => (typeof value === 'string' && value.length > max)
      ? (message || `No puede tener más de ${max} caracteres`)
      : null
  }),
  
  email: (message?: string): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      ? (message || 'Email inválido')
      : null
  }),
  
  phone: (message?: string): ValidationRule => ({
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    custom: (value) => (typeof value === 'string' && !/^[\+]?[1-9][\d]{0,15}$/.test(value))
      ? (message || 'Teléfono inválido')
      : null
  }),
  
  url: (message?: string): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    custom: (value) => (typeof value === 'string' && !/^https?:\/\/.+/.test(value))
      ? (message || 'URL inválida')
      : null
  })
}
