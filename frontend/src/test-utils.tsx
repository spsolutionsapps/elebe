import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001/api'
process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:3001'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock fetch
export const mockFetch = (data: any, status: number = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
  })
}

// Mock fetch error
export const mockFetchError = (error: string) => {
  global.fetch = jest.fn().mockRejectedValue(new Error(error))
}

// Mock fetch network error
export const mockFetchNetworkError = () => {
  global.fetch = jest.fn().mockRejectedValue({
    request: {},
    message: 'Network Error'
  })
}

// Mock fetch HTTP error
export const mockFetchHttpError = (status: number, message: string) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: jest.fn().mockResolvedValue({ message }),
    text: jest.fn().mockResolvedValue(JSON.stringify({ message })),
  })
}

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper to create mock data
export const createMockProduct = (overrides = {}) => ({
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  image: '/test-image.jpg',
  images: ['/test-image-1.jpg', '/test-image-2.jpg'],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createMockInquiry = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  message: 'Test message',
  status: 'new',
  products: [],
  followUpHistory: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
