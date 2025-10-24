# 🛡️ PROTECCIÓN DE DATOS DE BASE DE DATOS

## ⚠️ COMANDOS PELIGROSOS IDENTIFICADOS

### 🚨 Scripts que ELIMINAN datos (MODIFICADOS para ser seguros):

1. **`clean-docker.sh`** - ✅ **MODIFICADO** - Ahora preserva datos
2. **`clean-docker.ps1`** - ✅ **MODIFICADO** - Ahora preserva datos  
3. **`clean-dev.ps1`** - ⚠️ **PENDIENTE** - Necesita modificación
4. **`clean-dev.bat`** - ⚠️ **PENDIENTE** - Necesita modificación
5. **`maintenance.ps1`** - ✅ **MODIFICADO** - Ahora preserva datos

### 🔧 Scripts de migración (REVISAR antes de usar):

1. **`reset-migrations-emergency.sh`** - ⚠️ **PELIGROSO** - Elimina tabla de migraciones
2. **`fix-failed-migration.sh`** - ⚠️ **PELIGROSO** - Modifica migraciones
3. **`quick-fix-migration.sh`** - ⚠️ **PELIGROSO** - Marca migraciones como resueltas

## ✅ CONFIGURACIÓN SEGURA IMPLEMENTADA

### Docker Compose - Volúmenes Persistentes:

```yaml
# docker-compose.yml
volumes:
  elebe_postgres_data:
    labels:
      - "keep-data=true"  # ✅ Protege el volumen de limpieza automática
```

```yaml
# docker-compose.dev.yml  
volumes:
  postgres_data_dev:
    labels:
      - "keep-data=true"  # ✅ Protege el volumen de limpieza automática
```

### Scripts de Limpieza Seguros Creados:

1. **`clean-docker-safe.sh`** - ✅ **NUEVO** - Limpieza segura que preserva datos
2. **`clean-docker-safe.ps1`** - ✅ **NUEVO** - Limpieza segura que preserva datos
3. **`clean-docker-emergency.sh`** - ⚠️ **NUEVO** - Solo para casos extremos

## 🛡️ RECOMENDACIONES DE SEGURIDAD

### ✅ USAR SIEMPRE:

```bash
# Limpieza segura (recomendado)
./clean-docker-safe.sh
# o
./clean-docker-safe.ps1
```

### ⚠️ EVITAR (a menos que sea absolutamente necesario):

```bash
# Scripts originales modificados (ahora seguros)
./clean-docker.sh
./clean-docker.ps1

# Scripts de emergencia (solo casos extremos)
./clean-docker-emergency.sh
```

### 🚨 NUNCA USAR sin backup:

```bash
# Comandos que eliminan volúmenes
docker-compose down -v
docker volume prune -f
docker system prune -af
```

## 🔍 VERIFICACIÓN DE SEGURIDAD

### Comprobar volúmenes protegidos:

```bash
# Ver volúmenes con etiqueta de protección
docker volume ls --filter "label=keep-data"

# Verificar que los volúmenes de BD existen
docker volume ls | grep postgres
```

### Backup automático antes de operaciones críticas:

```bash
# Crear backup antes de cualquier operación de limpieza
docker exec lb-premium-db pg_dump -U postgres lb_premium > backup-$(date +%Y%m%d-%H%M%S).sql
```

## 📋 CHECKLIST DE SEGURIDAD

- [x] Volúmenes de BD configurados con etiquetas de protección
- [x] Scripts de limpieza modificados para preservar datos
- [x] Scripts seguros creados como alternativa
- [x] Script de emergencia con confirmación y backup
- [x] Documentación de seguridad creada
- [ ] Revisar y modificar `clean-dev.ps1` y `clean-dev.bat`
- [ ] Crear backups automáticos regulares
- [ ] Implementar monitoreo de volúmenes

## 🚨 PROCEDIMIENTO DE EMERGENCIA

Si necesitas limpiar completamente el sistema:

1. **Crear backup de emergencia:**
   ```bash
   docker exec lb-premium-db pg_dump -U postgres lb_premium > emergency-backup.sql
   ```

2. **Usar script de emergencia:**
   ```bash
   ./clean-docker-emergency.sh
   ```

3. **Restaurar desde backup si es necesario:**
   ```bash
   docker exec -i lb-premium-db psql -U postgres lb_premium < emergency-backup.sql
   ```

## 📞 CONTACTO

Para dudas sobre seguridad de datos, revisar este documento o contactar al administrador del sistema.
