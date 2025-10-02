import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export interface ApiError {
  message: string
  status?: number
  details?: any
}

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(false)

  const handleError = useCallback((error: any, showToast: boolean = true) => {
    let errorMessage = 'Ha ocurrido un error inesperado'
    let status: number | undefined

    if (error.response) {
      // Error de respuesta HTTP
      status = error.response.status
      const data = error.response.data
      
      if (data?.message) {
        errorMessage = data.message
      } else if (data?.error) {
        errorMessage = data.error
      } else {
        switch (status) {
          case 400:
            errorMessage = 'Solicitud inválida'
            break
          case 401:
            errorMessage = 'No autorizado'
            break
          case 403:
            errorMessage = 'Acceso denegado'
            break
          case 404:
            errorMessage = 'Recurso no encontrado'
            break
          case 409:
            errorMessage = 'Conflicto: El recurso ya existe'
            break
          case 422:
            errorMessage = 'Datos de validación inválidos'
            break
          case 500:
            errorMessage = 'Error interno del servidor'
            break
          default:
            errorMessage = `Error del servidor (${status})`
        }
      }
    } else if (error.request) {
      // Error de red
      errorMessage = 'Error de conexión. Verifica tu conexión a internet.'
    } else if (error.message) {
      // Error personalizado
      errorMessage = error.message
    }

    const apiError: ApiError = {
      message: errorMessage,
      status,
      details: error.response?.data || error
    }

    setError(apiError)

    if (showToast) {
      toast.error(errorMessage)
    }

    console.error('API Error:', apiError)
    return apiError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const executeWithErrorHandling = useCallback(async <T>(
    apiCall: () => Promise<T>,
    showToast: boolean = true
  ): Promise<T | null> => {
    setLoading(true)
    clearError()

    try {
      const result = await apiCall()
      return result
    } catch (error) {
      handleError(error, showToast)
      return null
    } finally {
      setLoading(false)
    }
  }, [handleError, clearError])

  return {
    error,
    loading,
    handleError,
    clearError,
    executeWithErrorHandling
  }
}

// Helper para validar respuestas de API
export function validateApiResponse(response: Response): boolean {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return true
}

// Helper para parsear errores de validación del backend
export function parseValidationErrors(errorData: any): Record<string, string> {
  if (errorData?.errors && Array.isArray(errorData.errors)) {
    const errors: Record<string, string> = {}
    errorData.errors.forEach((err: any) => {
      if (err.field && err.message) {
        errors[err.field] = err.message
      }
    })
    return errors
  }
  
  if (errorData?.validationErrors) {
    return errorData.validationErrors
  }
  
  return {}
}
