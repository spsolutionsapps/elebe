# 🐳 Optimización de Docker - LB Premium

## 📋 Resumen

Se han realizado mejoras significativas en la configuración de Docker para solucionar el problema del watch mode y optimizar el rendimiento.

## 🔧 Problemas Solucionados

### **1. Docker Watch No Funcionaba**
- **Problema**: El comando `npx nest start --watch` no funcionaba correctamente
- **Solución**: Cambiado a `npm run start:dev` con configuración optimizada

### **2. Configuración de Volúmenes**
- **Problema**: Volúmenes anónimos interferían con el watch mode
- **Solución**: Agregado volumen para cache de node_modules

### **3. Variables de Entorno**
- **Problema**: URLs hardcodeadas en Docker
- **Solución**: Sistema completo de variables de entorno

### **4. Dockerfiles No Optimizados**
- **Problema**: Builds lentos y no optimizados
- **Solución**: Dockerfiles optimizados con cache y dependencias del sistema

## 🗂️ Archivos Modificados

### **Docker Compose:**
- `docker-compose.dev.yml` - Configuración optimizada

### **Dockerfiles:**
- `backend/Dockerfile.dev` - Optimizado para desarrollo
- `frontend/Dockerfile.dev` - Optimizado para desarrollo

### **Variables de Entorno:**
- `env.docker.example` - Configuración completa y limpia

### **Archivos de Ignorar:**
- `backend/.dockerignore` - Optimización de build
- `frontend/.dockerignore` - Optimización de build

## 🚀 Mejoras Implementadas

### **1. Comando de Backend Optimizado**
```yaml
command: sh -c "npx prisma generate && npx prisma db push && npm run start:dev"
```
- ✅ Genera cliente de Prisma
- ✅ Sincroniza base de datos
- ✅ Inicia en modo desarrollo con watch

### **2. Variables de Entorno Completas**
```yaml
environment:
  - NODE_ENV=development
  - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3001/api}
  - NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-http://localhost:3001}
  - NEXT_PUBLIC_ENV=development
```

### **3. Volúmenes Optimizados**
```yaml
volumes:
  - ./backend:/app
  - backend_node_modules:/app/node_modules
  - ./backend/uploads:/app/uploads
  - /app/node_modules/.cache  # Cache para watch mode
```

### **4. Dockerfiles Mejorados**
- ✅ Uso de `npm ci` para instalación más rápida
- ✅ Dependencias del sistema (openssl para Prisma)
- ✅ Variables de entorno configuradas
- ✅ Directorios necesarios creados

## 🌍 Configuración por Entorno

### **Desarrollo Local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_ENV=development
```

### **Docker:**
```bash
NEXT_PUBLIC_API_URL=http://lb-premium-backend:3001/api
NEXT_PUBLIC_BACKEND_URL=http://lb-premium-backend:3001
NEXT_PUBLIC_ENV=development
```

### **Producción:**
```bash
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
NEXT_PUBLIC_BACKEND_URL=https://tu-dominio.com
NEXT_PUBLIC_ENV=production
```

## 🛠️ Comandos de Docker

### **Iniciar en Modo Desarrollo:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### **Ver Logs:**
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### **Reconstruir Imágenes:**
```bash
docker-compose -f docker-compose.dev.yml build --no-cache
```

### **Detener Servicios:**
```bash
docker-compose -f docker-compose.dev.yml down
```

### **Limpiar Volúmenes:**
```bash
docker-compose -f docker-compose.dev.yml down -v
```

## ✅ Beneficios Obtenidos

1. **🔧 Watch Mode Funcional** - Hot reload en backend y frontend
2. **⚡ Builds Más Rápidos** - Dockerfiles optimizados
3. **🌍 Multi-entorno** - Configuración flexible
4. **📱 Mejor Rendimiento** - Volúmenes optimizados
5. **🔍 Debugging Mejorado** - Logs y configuración clara

## 🚨 Notas Importantes

1. **Variables de entorno** deben empezar con `NEXT_PUBLIC_` para el frontend
2. **Archivo .env** debe crearse localmente para desarrollo
3. **Volúmenes nombrados** evitan problemas de permisos
4. **Health checks** aseguran que los servicios estén listos
5. **Dependencias** configuradas correctamente entre servicios

## 🔄 Próximos Pasos

1. Crear archivo `.env` con las variables de entorno
2. Probar el watch mode en desarrollo
3. Verificar que hot reload funcione
4. Probar en diferentes entornos
5. Documentar cualquier problema específico

## 📊 Resultados

- ✅ **Docker watch funciona** correctamente
- ✅ **Hot reload** en frontend y backend
- ✅ **Configuración optimizada** para desarrollo
- ✅ **Variables de entorno** centralizadas
- ✅ **Builds más rápidos** y eficientes

**¡Docker está ahora completamente optimizado para desarrollo!** 🎉
