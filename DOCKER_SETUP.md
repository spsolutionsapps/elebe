# 🐳 Configuración de Docker para LB Premium

## 📋 Archivos creados

✅ **Backend Dockerfile** - `backend/Dockerfile`
✅ **Frontend Dockerfile** - `frontend/Dockerfile`  
✅ **Docker Compose** - `docker-compose.yml`
✅ **Dockerignore files** - `backend/.dockerignore`, `frontend/.dockerignore`
✅ **Scripts actualizados** - `backend/package.json`
✅ **Next.js config** - `frontend/next.config.ts`

## 🚀 Comandos para usar Docker

### Iniciar todo el proyecto
```bash
docker-compose up -d
```

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Parar todos los servicios
```bash
docker-compose down
```

### Reiniciar un servicio específico
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Reconstruir y reiniciar
```bash
docker-compose up -d --build
```

## 🔧 Scripts npm disponibles

Desde el directorio `backend/`:

```bash
npm run docker:compose    # Iniciar con docker-compose
npm run docker:logs       # Ver logs
npm run docker:stop       # Parar servicios
npm run docker:restart    # Reiniciar servicios
```

## 🌐 URLs de acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Base de datos**: localhost:5432

## 📊 Servicios incluidos

1. **PostgreSQL** - Base de datos
2. **Backend NestJS** - API REST
3. **Frontend Next.js** - Interfaz web

## ⚡ Ventajas de Docker

- ✅ **No más cierres del backend**
- ✅ **Reinicio automático**
- ✅ **Base de datos incluida**
- ✅ **Un solo comando para todo**
- ✅ **Funciona igual en cualquier máquina**
- ✅ **Fácil despliegue a producción**

## 🛠️ Solución de problemas

### Si el backend no responde:
```bash
docker-compose logs backend
```

### Si hay problemas de permisos:
```bash
docker-compose down
docker-compose up -d --build
```

### Si la base de datos no conecta:
```bash
docker-compose restart postgres
```

## 🔐 Variables de entorno

Las variables están configuradas en `docker-compose.yml`:

- `DATABASE_URL`: Conexión a PostgreSQL
- `JWT_SECRET`: Clave secreta para JWT
- `NEXT_PUBLIC_API_URL`: URL del backend para el frontend

## 📝 Notas importantes

1. **Primera ejecución**: Puede tardar unos minutos en descargar las imágenes
2. **Base de datos**: Se crea automáticamente con datos de prueba
3. **Uploads**: Se mantienen en `backend/uploads/`
4. **Logs**: Se pueden ver con `docker-compose logs -f`
