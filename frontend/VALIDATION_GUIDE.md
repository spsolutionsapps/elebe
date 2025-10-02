# 🔍 Guía de Validaciones y Manejo de Errores

## 📋 **Sistema de Validaciones Implementado**

### **🎯 Características Principales:**

- ✅ **Validaciones en tiempo real** con feedback visual
- ✅ **Manejo de errores de API** centralizado
- ✅ **Componentes de formulario** con validación integrada
- ✅ **Hooks personalizados** para validación y manejo de errores
- ✅ **Notificaciones** mejoradas para feedback al usuario

## 🛠️ **Componentes Creados:**

### **1. Hook de Validación (`useValidation`)**
```typescript
import { useValidation, validationRules } from '@/hooks/useValidation'

const { values, errors, touched, setValue, validateForm } = useValidation(
  initialValues,
  validationRules
)
```

### **2. Hook de Manejo de Errores de API (`useApiError`)**
```typescript
import { useApiError } from '@/hooks/useApiError'

const { executeWithErrorHandling, loading, error } = useApiError()
```

### **3. Componentes de Formulario (`FormField`, `Input`, `Textarea`, `Select`)**
```typescript
import { FormField, Input, Textarea, Select } from '@/components/ui/form-field'

<FormField label="Nombre" error={errors.name} touched={touched.name} required>
  <Input
    value={values.name}
    onChange={(e) => setValue('name', e.target.value)}
    error={errors.name}
    touched={touched.name}
  />
</FormField>
```

### **4. Hook de Formulario (`useForm`)**
```typescript
import { useForm } from '@/hooks/useForm'

const {
  values,
  errors,
  touched,
  loading,
  handleSubmit,
  handleInputChange
} = useForm({
  initialValues,
  validationRules,
  onSubmit: async (values) => { /* API call */ }
})
```

## 📝 **Reglas de Validación Disponibles:**

### **Validaciones Básicas:**
```typescript
const rules = {
  name: validationRules.required('El nombre es requerido'),
  email: validationRules.email('Email inválido'),
  phone: validationRules.phone('Teléfono inválido'),
  url: validationRules.url('URL inválida'),
  minLength: validationRules.minLength(3, 'Mínimo 3 caracteres'),
  maxLength: validationRules.maxLength(100, 'Máximo 100 caracteres')
}
```

### **Validaciones Personalizadas:**
```typescript
const rules = {
  price: {
    required: true,
    custom: (value: string) => {
      const numValue = parseFloat(value)
      if (isNaN(numValue) || numValue < 0) {
        return 'El precio debe ser un número válido mayor o igual a 0'
      }
      return null
    }
  }
}
```

## 🎨 **Estados Visuales:**

### **Campo Válido:**
- Borde azul con focus
- Sin mensaje de error

### **Campo Inválido:**
- Borde rojo
- Mensaje de error visible
- Focus ring rojo

### **Campo Requerido:**
- Asterisco rojo (*) junto al label
- Validación automática

## 🔧 **Manejo de Errores de API:**

### **Errores HTTP Automáticos:**
- **400**: Solicitud inválida
- **401**: No autorizado
- **403**: Acceso denegado
- **404**: Recurso no encontrado
- **409**: Conflicto (recurso ya existe)
- **422**: Datos de validación inválidos
- **500**: Error interno del servidor

### **Errores de Red:**
- Detección automática de problemas de conexión
- Mensajes específicos para cada tipo de error

## 📱 **Componentes de Loading:**

### **LoadingSpinner:**
```typescript
<LoadingSpinner size="md" />
```

### **LoadingButton:**
```typescript
<LoadingButton loading={isLoading} loadingText="Guardando...">
  Guardar
</LoadingButton>
```

### **LoadingOverlay:**
```typescript
<LoadingOverlay isLoading={isLoading} message="Cargando datos...">
  <div>Contenido</div>
</LoadingOverlay>
```

### **Skeleton Components:**
```typescript
<SkeletonCard />
<SkeletonText lines={3} />
<Skeleton className="h-6 w-3/4" />
```

## 🚀 **Ejemplo de Uso Completo:**

```typescript
import { useForm } from '@/hooks/useForm'
import { FormField, Input, LoadingButton } from '@/components/ui'

export default function ProductForm() {
  const {
    values,
    errors,
    touched,
    loading,
    handleSubmit,
    handleInputChange
  } = useForm({
    initialValues: { name: '', price: '' },
    validationRules: {
      name: validationRules.required(),
      price: {
        required: true,
        custom: (value) => {
          const num = parseFloat(value)
          return isNaN(num) || num < 0 ? 'Precio inválido' : null
        }
      }
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(values)
      })
      return response.json()
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Nombre" error={errors.name} touched={touched.name} required>
        <Input
          value={values.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          touched={touched.name}
        />
      </FormField>
      
      <LoadingButton loading={loading}>
        Guardar Producto
      </LoadingButton>
    </form>
  )
}
```

## 🎯 **Beneficios:**

1. **UX Mejorada**: Feedback inmediato al usuario
2. **Código Limpio**: Validaciones reutilizables
3. **Manejo de Errores**: Centralizado y consistente
4. **Accesibilidad**: Labels y mensajes claros
5. **Mantenibilidad**: Fácil de extender y modificar

## 🔄 **Próximos Pasos:**

- [ ] Integrar con react-hook-form para mejor rendimiento
- [ ] Añadir validaciones del lado del servidor
- [ ] Implementar validaciones asíncronas
- [ ] Crear más componentes de formulario específicos
