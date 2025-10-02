import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import ProductFormWithValidation from '../ProductFormWithValidation'
import { mockFetch, mockFetchError } from '@/test-utils'

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}))

describe('ProductFormWithValidation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render form fields correctly', () => {
    render(<ProductFormWithValidation />)

    expect(screen.getByLabelText(/nombre del producto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/precio/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/estado/i)).toBeInTheDocument()
  })

  it('should show validation errors for required fields', async () => {
    render(<ProductFormWithValidation />)

    const submitButton = screen.getByRole('button', { name: /guardar producto/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/el nombre del producto es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/la descripción es requerida/i)).toBeInTheDocument()
      expect(screen.getByText(/el precio es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/la categoría es requerida/i)).toBeInTheDocument()
    })
  })

  it('should validate minimum length for name', async () => {
    render(<ProductFormWithValidation />)

    const nameInput = screen.getByLabelText(/nombre del producto/i)
    fireEvent.change(nameInput, { target: { value: 'ab' } })
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 3 caracteres/i)).toBeInTheDocument()
    })
  })

  it('should validate minimum length for description', async () => {
    render(<ProductFormWithValidation />)

    const descriptionInput = screen.getByLabelText(/descripción/i)
    fireEvent.change(descriptionInput, { target: { value: 'short' } })
    fireEvent.blur(descriptionInput)

    await waitFor(() => {
      expect(screen.getByText(/la descripción debe tener al menos 10 caracteres/i)).toBeInTheDocument()
    })
  })

  it('should validate price format', async () => {
    render(<ProductFormWithValidation />)

    const priceInput = screen.getByLabelText(/precio/i)
    fireEvent.change(priceInput, { target: { value: '-10' } })
    fireEvent.blur(priceInput)

    await waitFor(() => {
      expect(screen.getByText(/el precio debe ser un número válido mayor o igual a 0/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const mockProduct = { id: '1', name: 'Test Product' }
    mockFetch(mockProduct, 201)

    render(<ProductFormWithValidation />)

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/nombre del producto/i), {
      target: { value: 'Test Product' }
    })
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: 'This is a test product description' }
    })
    fireEvent.change(screen.getByLabelText(/precio/i), {
      target: { value: '99.99' }
    })
    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: 'ropa' }
    })

    const submitButton = screen.getByRole('button', { name: /guardar producto/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('Test Product')
        })
      )
    })
  })

  it('should handle API errors', async () => {
    mockFetchError('Network error')

    render(<ProductFormWithValidation />)

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/nombre del producto/i), {
      target: { value: 'Test Product' }
    })
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: 'This is a test product description' }
    })
    fireEvent.change(screen.getByLabelText(/precio/i), {
      target: { value: '99.99' }
    })
    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: 'ropa' }
    })

    const submitButton = screen.getByRole('button', { name: /guardar producto/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('should reset form when reset button is clicked', () => {
    render(<ProductFormWithValidation />)

    // Fill form
    fireEvent.change(screen.getByLabelText(/nombre del producto/i), {
      target: { value: 'Test Product' }
    })

    // Click reset
    const resetButton = screen.getByRole('button', { name: /limpiar/i })
    fireEvent.click(resetButton)

    // Check that form is reset
    expect(screen.getByLabelText(/nombre del producto/i)).toHaveValue('')
  })

  it('should disable submit button when form is invalid', () => {
    render(<ProductFormWithValidation />)

    const submitButton = screen.getByRole('button', { name: /guardar producto/i })
    expect(submitButton).toBeDisabled()
  })

  it('should enable submit button when form is valid', async () => {
    render(<ProductFormWithValidation />)

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/nombre del producto/i), {
      target: { value: 'Test Product' }
    })
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: 'This is a test product description' }
    })
    fireEvent.change(screen.getByLabelText(/precio/i), {
      target: { value: '99.99' }
    })
    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: 'ropa' }
    })

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /guardar producto/i })
      expect(submitButton).not.toBeDisabled()
    })
  })
})
