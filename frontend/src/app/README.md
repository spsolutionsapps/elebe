# App Router - Next.js 15

Este directorio contiene todas las páginas y rutas de la aplicación usando el App Router de Next.js.

## Estructura

### Páginas Públicas

- `page.tsx` - Página principal (Home)
- `catalogo/page.tsx` - Catálogo de productos
- `servicios/page.tsx` - Listado de servicios
- `nosotros/page.tsx` - Sección "Sobre Nosotros"
- `contacto/page.tsx` - Formulario de contacto

### Panel de Administración

- `admin/layout.tsx` - Layout del panel admin
- `admin/page.tsx` - Dashboard principal
- `admin/login/page.tsx` - Página de login

### API Routes

- `api/auth/[...nextauth]/route.ts` - Autenticación NextAuth
- `api/upload/route.ts` - Upload de imágenes
- `api/slides/route.ts` - CRUD de slides
- `api/products/route.ts` - CRUD de productos
- `api/services/route.ts` - CRUD de servicios
- `api/about/route.ts` - Gestión de contenido "Nosotros"
- `api/inquiries/route.ts` - Gestión de consultas

## Características

- **Server Components**: Uso de componentes del servidor para mejor rendimiento
- **Client Components**: Componentes del cliente donde es necesario interactividad
- **API Routes**: Endpoints RESTful para operaciones CRUD
- **Middleware**: Autenticación y autorización
- **Layouts**: Layouts anidados para reutilización
