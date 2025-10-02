import { renderHook, act } from '@testing-library/react'
import { useValidation, validationRules } from '../useValidation'

describe('useValidation', () => {
  const initialValues = {
    name: '',
    email: '',
    age: ''
  }

  const rules = {
    name: validationRules.required('El nombre es requerido'),
    email: validationRules.email('Email inválido'),
    age: {
      required: true,
      custom: (value: string) => {
        const num = parseInt(value)
        if (isNaN(num) || num < 0 || num > 120) {
          return 'La edad debe ser un número entre 0 y 120'
        }
        return null
      }
    }
  }

  it('should initialize with empty values and no errors', () => {
    const { result } = renderHook(() => useValidation(initialValues, rules))

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isValid).toBe(true)
  })

  it('should validate required fields', () => {
    const { result } = renderHook(() => useValidation(initialValues, rules))

    act(() => {
      result.current.validateForm()
    })

    expect(result.current.errors.name).toBe('El nombre es requerido')
    expect(result.current.errors.email).toBe('Este campo es requerido')
    expect(result.current.errors.age).toBe('Este campo es requerido')
    expect(result.current.isValid).toBe(false)
  })

  it('should validate email format', () => {
    const { result } = renderHook(() => useValidation(initialValues, rules))

    act(() => {
      result.current.setValue('email', 'invalid-email')
    })

    act(() => {
      result.current.validateForm()
    })

    expect(result.current.errors.email).toBe('Email inválido')
  })

  it('should validate custom rules', () => {
    const { result } = renderHook(() => useValidation(initialValues, rules))

    act(() => {
      result.current.setValue('age', '150')
    })

    act(() => {
      result.current.validateForm()
    })

    expect(result.current.errors.age).toBe('La edad debe ser un número entre 0 y 120')
  })

  it('should clear errors when values change', () => {
    const { result } = renderHook(() => useValidation(initialValues, rules))

    // First, create an error
    act(() => {
      result.current.validateForm()
    })

    expect(result.current.errors.name).toBe('El nombre es requerido')

    // Then, fix the error
    act(() => {
      result.current.setValue('name', 'John Doe')
    })

    expect(result.current.errors.name).toBeUndefined()
  })

  it('should track touched fields', () => {
    const { result } = renderHook(() => useValidation(initialValues, rules))

    act(() => {
      result.current.setFieldTouched('name')
    })

    expect(result.current.touched.name).toBe(true)
    expect(result.current.touched.email).toBeUndefined()
  })

  it('should reset form to initial values', () => {
    const { result } = renderHook(() => useValidation(initialValues, rules))

    // Modify values
    act(() => {
      result.current.setValue('name', 'John Doe')
      result.current.setValue('email', 'john@example.com')
    })

    // Reset
    act(() => {
      result.current.reset()
    })

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
  })
})

describe('validationRules', () => {
  it('should validate required fields', () => {
    const rule = validationRules.required('Campo requerido')
    expect(rule.custom?.('')).toBe('Campo requerido')
    expect(rule.custom?.('   ')).toBe('Campo requerido')
    expect(rule.custom?.('value')).toBeNull()
  })

  it('should validate email format', () => {
    const rule = validationRules.email('Email inválido')
    expect(rule.custom?.('invalid')).toBe('Email inválido')
    expect(rule.custom?.('test@example.com')).toBeNull()
  })

  it('should validate min length', () => {
    const rule = validationRules.minLength(3, 'Mínimo 3 caracteres')
    expect(rule.custom?.('ab')).toBe('Mínimo 3 caracteres')
    expect(rule.custom?.('abc')).toBeNull()
  })

  it('should validate max length', () => {
    const rule = validationRules.maxLength(5, 'Máximo 5 caracteres')
    expect(rule.custom?.('abcdef')).toBe('Máximo 5 caracteres')
    expect(rule.custom?.('abcde')).toBeNull()
  })
})
