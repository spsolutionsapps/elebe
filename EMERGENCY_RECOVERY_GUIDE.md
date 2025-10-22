# 🚨 GUÍA DE RECUPERACIÓN DE EMERGENCIA - PRODUCCIÓN

## ⚠️ SITUACIÓN ACTUAL
- **Problema**: Migración falló en producción y borró datos
- **Causa**: Workflows duplicados ejecutando migraciones conflictivas
- **Estado**: Base de datos vacía, tablas intactas

## 🔧 ACCIONES INMEDIATAS

### 1. Verificar Estado Actual
```bash
# Ejecutar script de diagnóstico
./emergency-db-recovery.sh
```

### 2. Restaurar Datos
```bash
# Ejecutar script de restauración
./restore-production-data.sh
```

### 3. Verificar Restauración
```bash
# Conectar al servidor de producción
ssh root@146.190.116.222

# Verificar datos restaurados
cd /root/elebe
docker exec lb-premium-db psql -U postgres -d lb_premium -c "SELECT COUNT(*) FROM \"Service\";"
docker exec lb-premium-db psql -U postgres -d lb_premium -c "SELECT COUNT(*) FROM \"User\";"
```

## 🛠️ CORRECCIONES IMPLEMENTADAS

### ✅ Workflows Corregidos
- **Eliminado**: `main-deploy-migrations.yml` (duplicado)
- **Deshabilitado**: `deploy-migrations.yml` (conflicto)
- **Mejorado**: `main.yml` con verificaciones de seguridad

### ✅ Mejoras de Seguridad
- Backup automático antes de migraciones
- Verificación de estado antes y después
- Logs detallados para debugging

## 📋 CHECKLIST DE RECUPERACIÓN

- [ ] Verificar conexión a base de datos
- [ ] Confirmar que las tablas existen
- [ ] Restaurar datos de servicios
- [ ] Restaurar usuario administrador
- [ ] Verificar que la aplicación funciona
- [ ] Probar login de administrador
- [ ] Verificar que los servicios se muestran

## 🔐 CREDENCIALES DE ADMINISTRADOR

```
Email: admin@lbpremium.com
Password: admin123
```

## 📞 CONTACTOS DE EMERGENCIA

- **Desarrollador Principal**: [Tu contacto]
- **Servidor**: 146.190.116.222
- **Base de Datos**: PostgreSQL en Docker

## 🚫 PREVENCIÓN FUTURA

### ❌ NUNCA HACER
- Ejecutar múltiples workflows de migración simultáneamente
- Aplicar migraciones sin backup
- Usar `prisma migrate deploy` sin verificar estado

### ✅ SIEMPRE HACER
- Crear backup antes de migraciones
- Verificar estado de migraciones
- Probar en desarrollo antes de producción
- Monitorear logs durante despliegues

## 📊 MONITOREO POST-RECUPERACIÓN

### Verificaciones Diarias (Primera Semana)
- [ ] Estado de la base de datos
- [ ] Funcionamiento de la aplicación
- [ ] Logs de errores
- [ ] Performance de la aplicación

### Verificaciones Semanales
- [ ] Backup automático funcionando
- [ ] Logs de migraciones
- [ ] Estado de los workflows

## 🔄 PROCESO DE MIGRACIÓN SEGURO

1. **Desarrollo**: Probar migración localmente
2. **Staging**: Aplicar en entorno de prueba
3. **Backup**: Crear backup de producción
4. **Migración**: Aplicar con monitoreo
5. **Verificación**: Confirmar que todo funciona
6. **Rollback**: Plan de contingencia listo

## 📝 LOGS IMPORTANTES

### Ubicaciones de Logs
- **Docker**: `docker logs lb-premium-db`
- **Aplicación**: `docker logs lb-premium-backend`
- **GitHub Actions**: En el repositorio GitHub

### Comandos Útiles
```bash
# Ver logs de base de datos
docker logs lb-premium-db --tail 50

# Ver logs de aplicación
docker logs lb-premium-backend --tail 50

# Estado de contenedores
docker ps

# Estado de migraciones
cd /root/elebe/backend && npx prisma migrate status
```

---

**⚠️ IMPORTANTE**: Esta guía debe actualizarse después de cada incidente para mejorar los procesos de recuperación.
