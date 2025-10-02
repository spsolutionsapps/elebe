# 🧪 Guía de Testing - LB Premium

## 📋 **Sistema de Testing Implementado**

### **🎯 Características Principales:**

- ✅ **Testing de Hooks** con React Testing Library
- ✅ **Testing de Componentes** con renderizado y interacciones
- ✅ **Testing de Integración** para formularios completos
- ✅ **Mocks y Utilidades** para testing robusto
- ✅ **Coverage Reports** con umbrales de calidad
- ✅ **Test Utils** personalizados para Next.js

## 🛠️ **Configuración de Testing:**

### **Jest Configuration:**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    // ... más aliases
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

### **Test Utils Personalizados:**
```typescript
// src/test-utils.tsx
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Custom render con providers
export const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

// Mocks para fetch
export const mockFetch = (data, status = 200) => { /* ... */ }
export const mockFetchError = (error) => { /* ... */ }
```

## 🧪 **Tipos de Tests Implementados:**

### **1. Tests de Hooks (`useValidation.test.ts`)**
```typescript
describe('useValidation', () => {
  it('should validate required fields', () => {
    const { result } = renderHook(() => useValidation(initialValues, rules))
    
    act(() => {
      result.current.validateForm()
    })
    
    expect(result.current.errors.name).toBe('El nombre es requerido')
  })
})
```

### **2. Tests de Componentes (`form-field.test.tsx`)**
```typescript
describe('FormField', () => {
  it('should show error message when error and touched', () => {
    render(
      <FormField label="Test Label" error="Test error" touched>
        <input />
      </FormField>
    )
    
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })
})
```

### **3. Tests de Integración (`ProductFormWithValidation.test.tsx`)**
```typescript
describe('ProductFormWithValidation', () => {
  it('should submit form with valid data', async () => {
    mockFetch(mockProduct, 201)
    
    render(<ProductFormWithValidation />)
    
    // Fill form and submit
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Test' } })
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(/* ... */)
    })
  })
})
```

## 🔧 **Utilidades de Testing:**

### **Mocks de API:**
```typescript
// Mock exitoso
mockFetch({ id: '1', name: 'Test' }, 200)

// Mock de error
mockFetchError('Network error')

// Mock de error HTTP
mockFetchHttpError(404, 'Not found')
```

### **Datos de Prueba:**
```typescript
// Crear datos mock
const mockProduct = createMockProduct({ name: 'Custom Name' })
const mockInquiry = createMockInquiry({ email: 'test@example.com' })
```

### **Helpers de Testing:**
```typescript
// Esperar operaciones async
await waitFor(100) // 100ms

// Render con providers
render(<Component />, { wrapper: AllTheProviders })
```

## 📊 **Coverage y Calidad:**

### **Umbrales de Coverage:**
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### **Comandos de Testing:**
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests específicos
npm test -- --testNamePattern="useValidation"
```

## 🎯 **Estructura de Tests:**

```
src/
├── hooks/
│   ├── __tests__/
│   │   ├── useValidation.test.ts
│   │   └── useApiError.test.ts
│   └── useValidation.ts
├── components/
│   ├── ui/
│   │   ├── __tests__/
│   │   │   ├── form-field.test.tsx
│   │   │   └── loading.test.tsx
│   │   └── form-field.tsx
│   └── examples/
│       ├── __tests__/
│       │   └── ProductFormWithValidation.test.tsx
│       └── ProductFormWithValidation.tsx
└── test-utils.tsx
```

## 🚀 **Ejemplos de Tests:**

### **Test de Hook Personalizado:**
```typescript
it('should handle API call errors', async () => {
  const { result } = renderHook(() => useApiError())
  
  const mockApiCall = jest.fn().mockRejectedValue({
    response: { status: 500, data: { message: 'Server error' } }
  })
  
  await act(async () => {
    await result.current.executeWithErrorHandling(mockApiCall)
  })
  
  expect(result.current.error?.message).toBe('Server error')
})
```

### **Test de Componente con Interacciones:**
```typescript
it('should validate form on submit', async () => {
  render(<ProductForm />)
  
  const submitButton = screen.getByRole('button', { name: /submit/i })
  fireEvent.click(submitButton)
  
  await waitFor(() => {
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })
})
```

### **Test de Integración Completo:**
```typescript
it('should create product successfully', async () => {
  mockFetch({ id: '1', name: 'Test Product' }, 201)
  
  render(<ProductForm />)
  
  // Fill form
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test' } })
  fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '99.99' } })
  
  // Submit
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  
  // Verify API call
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/products'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Test')
      })
    )
  })
})
```

## 🔍 **Mejores Prácticas:**

### **1. Naming Conventions:**
- Tests descriptivos: `should validate required fields`
- Agrupación lógica: `describe('useValidation', () => {})`
- Setup/Teardown: `beforeEach`, `afterEach`

### **2. Testing Patterns:**
- **Arrange**: Configurar datos y mocks
- **Act**: Ejecutar la acción a testear
- **Assert**: Verificar el resultado

### **3. Mocks y Stubs:**
- Mock de APIs externas
- Mock de hooks de Next.js
- Mock de dependencias complejas

### **4. Async Testing:**
- Usar `waitFor` para operaciones async
- Usar `act` para actualizaciones de estado
- Manejar promesas correctamente

## 📈 **Métricas de Calidad:**

### **Coverage Reports:**
```bash
npm run test:coverage
```

### **Resultados Esperados:**
- ✅ **Hooks**: 90%+ coverage
- ✅ **Components**: 80%+ coverage
- ✅ **Utils**: 95%+ coverage
- ✅ **Integration**: 70%+ coverage

## 🔄 **Próximos Pasos:**

- [ ] Añadir tests E2E con Playwright
- [ ] Implementar tests de performance
- [ ] Añadir tests de accesibilidad
- [ ] Crear tests de regresión visual
- [ ] Implementar CI/CD con testing automático
