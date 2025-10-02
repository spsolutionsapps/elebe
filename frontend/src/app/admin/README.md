# Panel de Administración

Este directorio contiene todas las páginas del panel de administración.

## Estructura

### Layout
- `layout.tsx` - Layout principal del panel admin con navegación lateral

### Páginas
- `page.tsx` - Dashboard principal con estadísticas
- `login/page.tsx` - Página de login para administradores

## Características

### Autenticación
- Protección de rutas con NextAuth
- Redirección automática a login si no autenticado
- Manejo de sesiones persistentes

### Navegación
- Sidebar responsive con navegación lateral
- Menú móvil para dispositivos pequeños
- Indicadores de página activa

### Dashboard
- Estadísticas en tiempo real
- Acceso rápido a funciones principales
- Estado del sistema
- Consultas recientes

## Acceso

### Credenciales por Defecto
- **Email**: admin@lbpremium.com
- **Contraseña**: admin123

### URL
- Panel: `/admin`
- Login: `/admin/login`

## Seguridad

### Recomendaciones
1. Cambiar las credenciales por defecto
2. Usar contraseñas fuertes
3. Habilitar autenticación de dos factores si es posible
4. Revisar logs de acceso regularmente

### Configuración
- Variables de entorno para NextAuth
- Configuración de sesiones JWT
- Timeout de sesión configurable
