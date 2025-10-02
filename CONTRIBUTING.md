# 🤝 Guía de Contribución - LB Premium CRM

¡Gracias por tu interés en contribuir a LB Premium CRM! Esta guía te ayudará a entender cómo contribuir de manera efectiva al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Contribución](#proceso-de-contribución)
- [Convenciones de Código](#convenciones-de-código)
- [Testing](#testing)
- [Documentación](#documentación)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Funcionalidades](#solicitar-funcionalidades)

## 📜 Código de Conducta

Este proyecto sigue un código de conducta para mantener un ambiente respetuoso y colaborativo. Al participar, te comprometes a:

- Ser respetuoso y inclusivo
- Aceptar críticas constructivas
- Enfocarte en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

## 🛠️ Configuración del Entorno

### Prerrequisitos

- Node.js 18+
- Docker Desktop
- Git
- Editor de código (VS Code recomendado)

### Setup Inicial

1. **Fork del repositorio**
   ```bash
   git clone https://github.com/tu-usuario/lb-premium.git
   cd lb-premium
   ```

2. **Configurar variables de entorno**
   ```bash
   cp env.docker.example .env
   cp frontend/env.example frontend/.env.local
   ```

3. **Iniciar con Docker**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Verificar instalación**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001/api
   - Swagger: http://localhost:3001/api/docs

### Desarrollo Local (Opcional)

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

## 🔄 Proceso de Contribución

### 1. Crear una Issue

Antes de empezar a codificar:

- [ ] Verificar que no existe una issue similar
- [ ] Crear una issue descriptiva con:
  - Descripción clara del problema/feature
  - Pasos para reproducir (si es un bug)
  - Screenshots (si aplica)
  - Etiquetas apropiadas

### 2. Crear una Branch

```bash
# Crear branch desde main
git checkout main
git pull origin main
git checkout -b feature/nombre-de-la-feature
# o
git checkout -b fix/descripcion-del-bug
```

### 3. Desarrollo

- [ ] Implementar la funcionalidad
- [ ] Escribir tests
- [ ] Actualizar documentación
- [ ] Verificar que no hay errores de linting

### 4. Testing

```bash
# Frontend
cd frontend
npm test
npm run test:coverage

# Backend
cd backend
npm test
npm run test:e2e
```

### 5. Commit

```bash
git add .
git commit -m "feat: añadir nueva funcionalidad de validación"
```

**Formato de commits:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Cambios en build, dependencias, etc.

### 6. Push y Pull Request

```bash
git push origin feature/nombre-de-la-feature
```

Crear Pull Request con:
- [ ] Descripción clara de los cambios
- [ ] Referencia a la issue relacionada
- [ ] Screenshots (si aplica)
- [ ] Checklist de verificación

## 📝 Convenciones de Código

### TypeScript/JavaScript

```typescript
// ✅ Bueno
interface User {
  id: string
  name: string
  email: string
}

const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// ❌ Malo
const getUserById = async (id) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

### React Components

```typescript
// ✅ Bueno
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  disabled?: boolean
}

export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// ❌ Malo
export function Button(props) {
  return <button {...props}>{props.children}</button>
}
```

### CSS/Tailwind

```css
/* ✅ Bueno - Usar clases de Tailwind */
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

/* ❌ Malo - CSS personalizado innecesario */
<div className="custom-button">
```

### Naming Conventions

- **Variables**: camelCase (`userName`, `isLoading`)
- **Funciones**: camelCase (`getUserById`, `handleSubmit`)
- **Componentes**: PascalCase (`UserCard`, `ProductForm`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Archivos**: kebab-case (`user-card.tsx`, `product-form.tsx`)

## 🧪 Testing

### Escribir Tests

```typescript
// ✅ Bueno
describe('useValidation', () => {
  it('should validate required fields', () => {
    const { result } = renderHook(() => useValidation(initialValues, rules))
    
    act(() => {
      result.current.validateForm()
    })
    
    expect(result.current.errors.name).toBe('El nombre es requerido')
  })
})

// ❌ Malo
it('should work', () => {
  expect(true).toBe(true)
})
```

### Coverage

- **Mínimo**: 70% de coverage
- **Objetivo**: 80%+ de coverage
- **Crítico**: 90%+ para hooks y utilidades

### Tipos de Tests

1. **Unit Tests**: Funciones y hooks individuales
2. **Component Tests**: Componentes React
3. **Integration Tests**: Flujos completos
4. **E2E Tests**: Casos de uso end-to-end

## 📚 Documentación

### Actualizar Documentación

- [ ] README.md para cambios importantes
- [ ] Guías específicas para nuevas funcionalidades
- [ ] Comentarios en código complejo
- [ ] JSDoc para funciones públicas

### Formato de Documentación

```markdown
# Título de la Sección

## Subtítulo

### Descripción
Explicación clara de la funcionalidad.

### Uso
```typescript
// Ejemplo de código
const result = useValidation(values, rules)
```

### Parámetros
- `values`: Valores iniciales del formulario
- `rules`: Reglas de validación

### Retorna
Objeto con valores, errores y funciones de validación.
```

## 🐛 Reportar Bugs

### Template de Bug Report

```markdown
**Descripción**
Descripción clara del problema.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

**Comportamiento Esperado**
Lo que debería pasar.

**Comportamiento Actual**
Lo que está pasando.

**Screenshots**
Si aplica, añadir screenshots.

**Información del Sistema**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Versión: [e.g. 2.0.0]

**Logs**
```
Pegar logs relevantes aquí
```
```

## 💡 Solicitar Funcionalidades

### Template de Feature Request

```markdown
**¿Es tu solicitud relacionada con un problema?**
Descripción clara del problema.

**Describe la solución que te gustaría**
Descripción clara de la funcionalidad deseada.

**Describe alternativas que has considerado**
Otras soluciones que has pensado.

**Contexto adicional**
Cualquier otro contexto sobre la solicitud.
```

## 🔍 Code Review

### Como Reviewer

- [ ] Verificar que el código sigue las convenciones
- [ ] Revisar que los tests están incluidos
- [ ] Verificar que la documentación está actualizada
- [ ] Probar la funcionalidad localmente
- [ ] Verificar que no hay regresiones

### Como Author

- [ ] Responder a comentarios constructivamente
- [ ] Hacer cambios solicitados
- [ ] Explicar decisiones de diseño
- [ ] Mantener el PR actualizado

## 🚀 Release Process

### Versionado

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR**: Cambios incompatibles
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de bugs

### Changelog

- [ ] Actualizar CHANGELOG.md
- [ ] Incluir todas las características nuevas
- [ ] Documentar breaking changes
- [ ] Incluir notas de migración

## 📞 Contacto

- 📧 Email: dev@lbpremium.com
- 💬 Discord: [Servidor de la comunidad]
- 📱 WhatsApp: +1234567890

## 🙏 Agradecimientos

Gracias a todos los contribuidores que hacen posible este proyecto:

- [Lista de contribuidores]

---

**¡Gracias por contribuir a LB Premium CRM!** 🎉
