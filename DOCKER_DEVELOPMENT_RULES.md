# 🐳 Reglas de Desarrollo con Docker - LB Premium

## ⚠️ REGLAS OBLIGATORIAS

### 1. **Siempre usar Docker para el Backend**
- ✅ **CORRECTO**: `docker-compose -f docker-compose.dev.yml exec backend [comando]`
- ❌ **INCORRECTO**: `npm run start:dev` directamente en el host
- ❌ **INCORRECTO**: `cd backend && npm run start:dev`

### 2. **Comandos de Docker Compose**
```bash
# Levantar servicios
docker-compose -f docker-compose.dev.yml up -d

# Detener servicios
docker-compose -f docker-compose.dev.yml down

# Ver logs
docker-compose -f docker-compose.dev.yml logs [servicio]

# Ejecutar comandos en contenedores
docker-compose -f docker-compose.dev.yml exec backend [comando]
docker-compose -f docker-compose.dev.yml exec frontend [comando]
```

### 3. **Variables de Entorno Correctas**
- ✅ **Para Docker**: `NEXT_PUBLIC_API_URL=http://backend:3001/api`
- ❌ **Nunca usar**: `NEXT_PUBLIC_API_URL=http://localhost:3001/api` (solo para desarrollo local)

### 4. **Comandos de Base de Datos**
```bash
# Resetear base de datos
docker-compose -f docker-compose.dev.yml exec backend npx prisma db push --force-reset

# Ejecutar migraciones
docker-compose -f docker-compose.dev.yml exec backend npx prisma migrate deploy

# Ejecutar seeds
docker-compose -f docker-compose.dev.yml exec backend npx ts-node scripts/seed.ts

# Abrir Prisma Studio
docker-compose -f docker-compose.dev.yml exec backend npx prisma studio --port 5555
```

### 5. **Limpieza de Caché**
```bash
# Limpiar volúmenes de Docker
docker volume prune -f

# Limpiar imágenes no utilizadas
docker image prune -f

# Limpiar todo (cuidado!)
docker system prune -f
```

### 6. **Verificación de Estado**
```bash
# Verificar que los contenedores estén corriendo
docker-compose -f docker-compose.dev.yml ps

# Verificar variables de entorno
docker-compose -f docker-compose.dev.yml exec frontend printenv | grep NEXT_PUBLIC
```

### 7. **Solución de Problemas Comunes**

#### Error: "fetch failed" o "No es posible conectar con el servidor remoto"

**CAUSA**: El frontend está usando `process.env.NEXT_PUBLIC_API_URL` que apunta a `http://backend:3001/api`, pero desde el navegador no puede acceder a esa URL interna de Docker.

**SOLUCIÓN DEFINITIVA**:
```bash
# 1. Ejecutar el script de corrección automática
.\fix-api-urls.ps1

# 2. Reiniciar Docker
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

**SOLUCIÓN MANUAL** (si el script no funciona):
- Cambiar todas las instancias de `process.env.NEXT_PUBLIC_API_URL` por `http://localhost:3001/api` en los archivos del frontend
- Los archivos principales son:
  - `frontend/src/app/(public)/page.tsx`
  - `frontend/src/components/ServicesSection.tsx`
  - `frontend/src/components/BrandsSlider.tsx`
  - `frontend/src/app/(public)/servicios/page.tsx`

#### Error: "Missing script: start:dev"
- **Causa**: Intentando ejecutar npm en el host en lugar de Docker
- **Solución**: Usar `docker-compose -f docker-compose.dev.yml exec backend npm run start:dev`

#### Error: "The column Service.title does not exist"
```bash
# Resetear base de datos y aplicar schema
docker-compose -f docker-compose.dev.yml exec backend npx prisma db push --force-reset
docker-compose -f docker-compose.dev.yml exec backend npx ts-node scripts/seed.ts
```

### 8. **Flujo de Trabajo Recomendado**

1. **Iniciar desarrollo**:
   ```bash
   $env:NEXT_PUBLIC_API_URL="http://backend:3001/api"
   $env:NEXT_PUBLIC_BACKEND_URL="http://backend:3001"
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Verificar estado**:
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

3. **Hacer cambios en el código** (se reflejan automáticamente)

4. **Si hay problemas de base de datos**:
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend npx prisma db push --force-reset
   docker-compose -f docker-compose.dev.yml exec backend npx ts-node scripts/seed.ts
   ```

5. **Si hay problemas de caché**:
   ```bash
   docker-compose -f docker-compose.dev.yml down
   docker volume prune -f
   docker-compose -f docker-compose.dev.yml up -d
   ```

## 🚨 RECORDATORIOS IMPORTANTES

- **NUNCA** ejecutar comandos npm directamente en el host
- **SIEMPRE** usar Docker para el backend
- **SIEMPRE** verificar variables de entorno
- **SIEMPRE** usar `http://backend:3001/api` para comunicación entre contenedores
- **SIEMPRE** limpiar caché cuando haya problemas persistentes

## 📝 NOTAS

- El archivo `.env` puede sobrescribir las variables de Docker
- Usar `$env:VARIABLE="valor"` en PowerShell para sobrescribir temporalmente
- Los volúmenes de Docker mantienen caché entre reinicios
- Prisma Studio está disponible en `http://localhost:5555` cuando se ejecuta
