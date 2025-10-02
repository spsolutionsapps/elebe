import { renderHook, act } from '@testing-library/react'
import { useApiError, validateApiResponse, parseValidationErrors } from '../useApiError'

// Mock fetch
global.fetch = jest.fn()

describe('useApiError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with no error and not loading', () => {
    const { result } = renderHook(() => useApiError())

    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should handle HTTP errors correctly', async () => {
    const { result } = renderHook(() => useApiError())

    const mockError = {
      response: {
        status: 404,
        data: { message: 'Not found' }
      }
    }

    act(() => {
      result.current.handleError(mockError)
    })

    expect(result.current.error).toEqual({
      message: 'Not found',
      status: 404,
      details: mockError.response.data
    })
  })

  it('should handle network errors', () => {
    const { result } = renderHook(() => useApiError())

    const mockError = {
      request: {},
      message: 'Network Error'
    }

    act(() => {
      result.current.handleError(mockError)
    })

    expect(result.current.error?.message).toBe('Error de conexión. Verifica tu conexión a internet.')
  })

  it('should handle custom errors', () => {
    const { result } = renderHook(() => useApiError())

    const mockError = {
      message: 'Custom error message'
    }

    act(() => {
      result.current.handleError(mockError)
    })

    expect(result.current.error?.message).toBe('Custom error message')
  })

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useApiError())

    // First, set an error
    act(() => {
      result.current.handleError({ message: 'Test error' })
    })

    expect(result.current.error).not.toBeNull()

    // Then clear it
    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('should execute API call with error handling', async () => {
    const { result } = renderHook(() => useApiError())

    const mockApiCall = jest.fn().mockResolvedValue('success')

    let apiResult
    await act(async () => {
      apiResult = await result.current.executeWithErrorHandling(mockApiCall)
    })

    expect(apiResult).toBe('success')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle API call errors', async () => {
    const { result } = renderHook(() => useApiError())

    const mockApiCall = jest.fn().mockRejectedValue({
      response: {
        status: 500,
        data: { message: 'Server error' }
      }
    })

    let apiResult
    await act(async () => {
      apiResult = await result.current.executeWithErrorHandling(mockApiCall)
    })

    expect(apiResult).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error?.message).toBe('Server error')
  })
})

describe('validateApiResponse', () => {
  it('should return true for successful responses', () => {
    const response = { ok: true, status: 200 } as Response
    expect(validateApiResponse(response)).toBe(true)
  })

  it('should throw error for failed responses', () => {
    const response = { ok: false, status: 404, statusText: 'Not Found' } as Response
    
    expect(() => validateApiResponse(response)).toThrow('HTTP 404: Not Found')
  })
})

describe('parseValidationErrors', () => {
  it('should parse array of validation errors', () => {
    const errorData = {
      errors: [
        { field: 'name', message: 'Name is required' },
        { field: 'email', message: 'Email is invalid' }
      ]
    }

    const result = parseValidationErrors(errorData)
    expect(result).toEqual({
      name: 'Name is required',
      email: 'Email is invalid'
    })
  })

  it('should parse validationErrors object', () => {
    const errorData = {
      validationErrors: {
        name: 'Name is required',
        email: 'Email is invalid'
      }
    }

    const result = parseValidationErrors(errorData)
    expect(result).toEqual({
      name: 'Name is required',
      email: 'Email is invalid'
    })
  })

  it('should return empty object for invalid data', () => {
    const result = parseValidationErrors({})
    expect(result).toEqual({})
  })
})
