# 🔄 Guía de Migración: Frontend + Backend Separados

## 🎯 Objetivo
Separar el proyecto actual en frontend (Next.js) y backend (NestJS) para crear un CRM escalable.

## 📋 Pasos de Migración

### ✅ **Paso 1: Estructura creada**
- ✅ Carpetas `frontend/`, `backend/`, `shared/` creadas
- ✅ Archivos movidos a sus respectivas carpetas
- ✅ Configuraciones básicas del backend creadas

### 🔧 **Paso 2: Completar instalación del backend**

```powershell
# 1. Ir al backend
cd backend

# 2. Copiar variables de entorno
copy ..\env.example .env

# 3. Editar .env con tus configuraciones
# DATABASE_URL="postgresql://postgres:password@localhost:5432/lb_premium"
# JWT_SECRET="fashion-style-super-secret-jwt-key-2024"
# etc.

# 4. Instalar dependencias faltantes
npm install @nestjs/typeorm typeorm pg

# 5. Generar Prisma
npx prisma generate

# 6. Ejecutar migraciones
npx prisma migrate dev

# 7. Poblar base de datos
npm run db:seed
```

### 🔧 **Paso 3: Configurar frontend para usar API**

```powershell
# 1. Ir al frontend
cd ..\frontend

# 2. Crear .env.local
echo "NEXTAUTH_SECRET=fashion-style-secret-2024" > .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" >> .env.local

# 3. Instalar dependencias adicionales para API
npm install axios
```

### 🔧 **Paso 4: Crear cliente API en frontend**

Crear `frontend/src/lib/api-client.ts`:
```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
```

### 🔧 **Paso 5: Ejecutar ambos servidores**

```powershell
# Desde la raíz del proyecto
npm run dev

# O por separado:
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## 🌐 **URLs después de la migración**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs
- **Admin Panel**: http://localhost:3000/admin

## 🔑 **Credenciales**

- **Email**: `admin@fashionstyle.com`
- **Contraseña**: `admin123`

## ✨ **Próximos pasos del CRM**

### 1. **Gestión de Clientes** 
```typescript
// backend/src/customers/
- customers.entity.ts
- customers.service.ts
- customers.controller.ts
- dto/create-customer.dto.ts
```

### 2. **Pipeline de Ventas**
```typescript
// backend/src/sales/
- leads.entity.ts
- opportunities.entity.ts
- sales.service.ts
```

### 3. **Sistema de Tareas**
```typescript
// backend/src/tasks/
- tasks.entity.ts
- reminders.entity.ts
- notifications.service.ts
```

### 4. **Reportes y Analytics**
```typescript
// backend/src/analytics/
- sales-reports.service.ts
- customer-insights.service.ts
- dashboard.controller.ts
```

## 🛠️ **Comandos útiles**

```powershell
# Instalar todas las dependencias
npm run install:all

# Limpiar node_modules
npm run clean

# Ver base de datos
cd backend && npx prisma studio

# Verificar tipos
cd frontend && npm run type-check

# Build para producción
npm run build
```

## 🚨 **Posibles errores y soluciones**

### Error EPERM en Prisma
```powershell
# Limpiar cache y reinstalar
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### Error de CORS
- Verificar que `FRONTEND_URL` esté configurado correctamente
- Comprobar que ambos servidores estén ejecutándose

### Error de JWT
- Verificar que `JWT_SECRET` esté configurado
- Comprobar que el token se esté enviando correctamente

---

## 🎉 **¡Migración Completada!**

Una vez completados estos pasos, tendrás:

✅ **Backend NestJS** robusto y escalable
✅ **Frontend Next.js** optimizado  
✅ **Arquitectura separada** lista para CRM
✅ **Documentación Swagger** automática
✅ **Base sólida** para funcionalidades avanzadas

¡Tu sistema está listo para convertirse en un CRM completo! 🚀
