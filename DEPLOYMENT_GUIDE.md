# 🚀 Guía de Despliegue - LB Premium CRM

## 📋 Resumen del Sistema

**LB Premium CRM** es un sistema completo de gestión de clientes con:
- ✅ **Frontend**: Next.js 15.5.2 con optimizaciones avanzadas
- ✅ **Backend**: NestJS con Prisma ORM
- ✅ **Base de Datos**: PostgreSQL
- ✅ **Contenedores**: Docker y Docker Compose
- ✅ **Optimizaciones**: Performance, validaciones, testing, documentación

## 🐳 Despliegue con Docker

### **Desarrollo Local**
```bash
# Iniciar servicios de desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios
docker-compose -f docker-compose.dev.yml down
```

### **Producción**
```bash
# Iniciar servicios de producción
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🔧 Configuración de Producción

### **Variables de Entorno**
```bash
# Copiar archivo de ejemplo
cp env.docker.example .env

# Configurar variables
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
NEXT_PUBLIC_BACKEND_URL=https://tu-dominio.com
DATABASE_URL=postgresql://usuario:password@db:5432/lb_premium
```

### **Base de Datos**
```bash
# Ejecutar migraciones
docker-compose exec backend npx prisma migrate deploy

# Generar cliente Prisma
docker-compose exec backend npx prisma generate
```

## 📊 Monitoreo y Mantenimiento

### **Health Checks**
- **Frontend**: http://localhost:3000/health
- **Backend**: http://localhost:3001/health
- **Base de Datos**: Verificar conexión en logs

### **Logs Importantes**
```bash
# Ver logs del frontend
docker-compose logs frontend

# Ver logs del backend
docker-compose logs backend

# Ver logs de la base de datos
docker-compose logs db
```

## 🔒 Seguridad

### **Configuraciones Aplicadas**
- ✅ Headers de seguridad (X-Frame-Options, X-XSS-Protection)
- ✅ Content Security Policy para imágenes
- ✅ Validación de tipos TypeScript
- ✅ Linting con ESLint
- ✅ Variables de entorno seguras

### **Recomendaciones Adicionales**
- 🔐 Usar HTTPS en producción
- 🔐 Configurar firewall
- 🔐 Backup regular de base de datos
- 🔐 Monitoreo de logs de seguridad

## 📈 Performance

### **Optimizaciones Implementadas**
- ✅ Lazy loading de componentes
- ✅ Optimización de imágenes (WebP, AVIF)
- ✅ Code splitting automático
- ✅ Compresión gzip
- ✅ Cache headers optimizados
- ✅ Bundle size optimizado

### **Métricas Esperadas**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Bundle Size**: < 500KB inicial

## 🧪 Testing

### **Ejecutar Tests**
```bash
# Tests unitarios
docker-compose exec frontend npm test

# Tests con coverage
docker-compose exec frontend npm run test:coverage

# Tests del backend
docker-compose exec backend npm test
```

## 🔄 Actualizaciones

### **Proceso de Actualización**
1. **Backup** de base de datos
2. **Pull** de nuevas imágenes
3. **Migraciones** de base de datos
4. **Restart** de servicios
5. **Verificación** de funcionalidad

```bash
# Ejemplo de actualización
docker-compose pull
docker-compose down
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
```

## 📞 Soporte

### **Archivos de Logs**
- `docker-compose logs frontend` - Logs del frontend
- `docker-compose logs backend` - Logs del backend
- `docker-compose logs db` - Logs de la base de datos

### **Comandos de Diagnóstico**
```bash
# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats

# Verificar conectividad
docker-compose exec frontend curl http://backend:3001/health
```

## 🎯 Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL accesible
- [ ] Certificados SSL configurados (producción)
- [ ] Backup de base de datos realizado
- [ ] Health checks funcionando
- [ ] Logs monitoreados
- [ ] Performance verificada
- [ ] Tests ejecutados exitosamente

---

**¡Sistema listo para producción! 🚀**

