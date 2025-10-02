# 🎨 LB Premium CRM

Sistema CRM completo para LB Premium con arquitectura moderna, escalable y optimizada.

## 🏗️ Arquitectura

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript + PostgreSQL
- **Autenticación**: JWT + Passport
- **Base de datos**: PostgreSQL con Prisma ORM
- **Documentación**: Swagger/OpenAPI
- **Containerización**: Docker + Docker Compose
- **Testing**: Jest + React Testing Library
- **Validaciones**: Sistema robusto de validaciones y manejo de errores
- **Optimización**: Lazy loading, bundle optimization, hot reload

## 🚀 Inicio Rápido con Docker (Recomendado)

### Prerrequisitos
- Docker Desktop instalado
- Git

### Pasos
1. **Clonar el repositorio**
   ```bash
   git clone [tu-repo]
   cd lb-premium
   ```

2. **Iniciar con Docker**
   ```bash
   # Opción 1: Script automático
   ./start-docker.bat        # Windows
   ./start-docker.ps1        # PowerShell
   
   # Opción 2: Comando manual
   docker-compose up -d --build
   ```

3. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - Swagger Docs: http://localhost:3001/api/docs

### Comandos Docker útiles
```bash
# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down

# Reiniciar un servicio
docker-compose restart backend

# Reconstruir
docker-compose up -d --build
```

## 🛠️ Desarrollo Local (Sin Docker)

### Prerrequisitos
- Node.js 18+
- PostgreSQL
- npm o yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env.development
npm run build
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Configuración Avanzada

### Variables de Entorno
Para personalizar la configuración, copia `env.docker.example` a `.env`:

```bash
cp env.docker.example .env
```

### Variables disponibles:
- `POSTGRES_PASSWORD`: Contraseña de la base de datos
- `JWT_SECRET`: Clave secreta para JWT
- `FRONTEND_URL`: URL del frontend
- `ADMIN_URL`: URL del panel de administración
- `NEXT_PUBLIC_API_URL`: URL de la API para el frontend
- `PRODUCTION_DOMAINS`: Dominios de producción para CORS (separados por comas)

## 📁 Estructura del Proyecto

```
lb-premium/
├── frontend/                 # Aplicación Next.js
│   ├── src/
│   │   ├── app/             # Páginas y rutas
│   │   ├── components/      # Componentes reutilizables
│   │   ├── contexts/        # Contextos de React
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── lib/             # Utilidades
│   │   └── types/           # Tipos TypeScript
│   ├── public/              # Archivos estáticos
│   └── Dockerfile           # Configuración Docker
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/            # Autenticación
│   │   ├── clients/         # Gestión de clientes
│   │   ├── inquiries/       # Consultas
│   │   ├── products/        # Productos
│   │   ├── services/        # Servicios
│   │   ├── slides/          # Slides del home
│   │   ├── reminders/       # Recordatorios
│   │   ├── tasks/           # Tareas
│   │   ├── upload/          # Subida de archivos
│   │   └── prisma/          # Configuración Prisma
│   ├── prisma/              # Esquemas de base de datos
│   └── Dockerfile           # Configuración Docker
├── docker-compose.yml       # Orquestación de servicios
├── start-docker.bat         # Script de inicio Windows
├── start-docker.ps1         # Script de inicio PowerShell
├── stop-docker.bat          # Script de parada Windows
├── stop-docker.ps1          # Script de parada PowerShell
└── DOCKER_SETUP.md          # Documentación Docker
```

## 🎯 Características Principales

### CRM y Gestión
- ✅ **Gestión de Consultas**: Crear, editar y hacer seguimiento
- ✅ **Sistema de Recordatorios**: Programar recordatorios automáticos
- ✅ **Gestión de Clientes**: Convertir consultas en clientes
- ✅ **Historial de Seguimientos**: Seguimiento completo de interacciones

### Productos y Servicios
- ✅ **Catálogo de Productos**: Gestión completa con imágenes
- ✅ **Servicios**: Gestión de servicios ofrecidos
- ✅ **Slides del Home**: Carrusel de imágenes personalizable

### Tareas y Organización
- ✅ **Sistema de Tareas**: Gestión de tareas pendientes
- ✅ **Prioridades**: Clasificación por prioridad
- ✅ **Estados**: Seguimiento del progreso

### Técnicas
- ✅ **Autenticación JWT**: Sistema seguro de login
- ✅ **Subida de Archivos**: Gestión de imágenes
- ✅ **API REST**: Endpoints documentados con Swagger
- ✅ **Base de Datos**: PostgreSQL con Prisma ORM
- ✅ **Containerización**: Docker para desarrollo y producción

### 🆕 Nuevas Características (v2.0)
- ✅ **Sistema de Validaciones**: Validaciones robustas en tiempo real
- ✅ **Manejo de Errores**: Sistema centralizado de manejo de errores
- ✅ **Testing Completo**: Tests unitarios, de integración y E2E
- ✅ **Optimización de Rendimiento**: Lazy loading y bundle optimization
- ✅ **Hot Reload**: Desarrollo con recarga automática
- ✅ **Configuración Centralizada**: Variables de entorno y configuración unificada
- ✅ **Componentes Reutilizables**: Biblioteca de componentes UI optimizada

## 🔧 Scripts Disponibles

### Backend
```bash
npm run build              # Compilar
npm run start:dev          # Desarrollo con watch
npm run start:prod         # Producción
npm run docker:compose     # Iniciar con Docker
npm run docker:logs        # Ver logs Docker
npm run docker:stop        # Parar Docker
```

### Frontend
```bash
npm run dev                # Desarrollo
npm run build              # Compilar
npm run start              # Producción
npm run lint               # Linter
```

## 🌐 URLs de Acceso

### Desarrollo Local
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api
- Swagger: http://localhost:3001/api/docs

### Docker
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api
- Database: localhost:5432

## 🔐 Variables de Entorno

### Backend (.env.development)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📊 Base de Datos

### Migraciones
```bash
cd backend
npm run db:migrate         # Aplicar migraciones
npm run db:reset           # Resetear base de datos
npm run db:studio          # Abrir Prisma Studio
```

### Seeders
```bash
npm run db:seed            # Poblar con datos de prueba
```

## 🚀 Despliegue

### Docker (Recomendado)
```bash
docker-compose up -d --build
```

### Manual
1. Configurar variables de entorno
2. Ejecutar migraciones
3. Compilar frontend y backend
4. Iniciar servicios

## 📚 Guías de Desarrollo

### 🔍 Validaciones y Manejo de Errores
- **[VALIDATION_GUIDE.md](frontend/VALIDATION_GUIDE.md)**: Sistema completo de validaciones
- **[TESTING_GUIDE.md](frontend/TESTING_GUIDE.md)**: Guía de testing y calidad de código
- **[DOCKER_OPTIMIZACION.md](DOCKER_OPTIMIZACION.md)**: Optimizaciones de Docker

### 🛠️ Configuración y Setup
- **[CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)**: Configuración completa del proyecto
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)**: Setup de Docker paso a paso
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)**: Guía de migración de datos

### 🎨 Frontend
- **[REACT_SELECT_IMPLEMENTATION.md](REACT_SELECT_IMPLEMENTATION.md)**: Implementación de componentes select
- **[PRODUCT_PAGES_GUIDE.md](PRODUCT_PAGES_GUIDE.md)**: Páginas de productos individuales
- **[UPLOAD_GUIDE.md](UPLOAD_GUIDE.md)**: Sistema de subida de archivos

### 🔧 Backend
- **[REMINDER_INTEGRATION_GUIDE.md](REMINDER_INTEGRATION_GUIDE.md)**: Sistema de recordatorios
- **[SOLUCION_ENDPOINT_404.md](SOLUCION_ENDPOINT_404.md)**: Solución de problemas de endpoints

## 🛠️ Solución de Problemas

### Backend no responde
```bash
# Ver logs
docker-compose logs backend

# Reiniciar
docker-compose restart backend
```

### Base de datos no conecta
```bash
# Verificar estado
docker-compose ps
```

### Problemas de Build
```bash
# Limpiar cache
npm run clean

# Reinstalar dependencias
npm ci

# Rebuild completo
docker-compose down
docker-compose up --build
```

### Problemas de Testing
```bash
# Ejecutar tests con verbose
npm test -- --verbose

# Ejecutar tests específicos
npm test -- --testNamePattern="useValidation"

# Ver coverage
npm run test:coverage
```

# Reiniciar base de datos
docker-compose restart postgres
```

### Frontend no carga
```bash
# Ver logs
docker-compose logs frontend

# Reconstruir
docker-compose up -d --build frontend
```

## 📝 Notas de Desarrollo

- El backend se reinicia automáticamente con Docker
- Las imágenes se mantienen en `backend/uploads/`
- Los logs se pueden ver con `docker-compose logs -f`
- La base de datos se crea automáticamente

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.