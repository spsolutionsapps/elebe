# Guía de Backup y Restauración

Scripts simples para hacer backup antes de un deploy y restaurar si algo sale mal.

> **Nota:** Si usas Digital Ocean con backups automáticos diarios, estos scripts son un complemento útil para backups específicos antes de deploys críticos.

## 📋 Requisitos

- `pg_dump` y `pg_restore` instalados (vienen con PostgreSQL)
- Acceso SSH al servidor
- Permisos de lectura/escritura en el directorio del proyecto

## 🚀 Uso Rápido

### Antes de hacer deploy:

```bash
# 1. Conectarse al servidor vía SSH
ssh root@146.190.116.222

# 2. Ir al directorio del backend
cd /root/www/html/elebe/backend

# 3. Hacer backup
./backup.sh

# O con un nombre personalizado
./backup.sh backup_antes_de_migracion_v2
```

**IMPORTANTE:** La primera vez que uses los scripts, dales permisos:
```bash
chmod +x backup.sh restore.sh
```

### Si el deploy falla y necesitas restaurar:

```bash
# 1. Conectarse al servidor
ssh root@146.190.116.222

# 2. Ir al directorio del backend
cd /root/www/html/elebe/backend

# 3. Ver backups disponibles
ls backups/

# 4. Restaurar desde un backup (usa el nombre exacto que te mostró)
./restore.sh backup_20251216_233009

# Te pedirá confirmación, escribe: SI
```

## 📁 Estructura de Backups

Los backups se guardan en `./backups/[nombre-del-backup]/`:

```
backups/
  └── backup_20250116_080000/
      ├── database.dump          # Dump completo de PostgreSQL
      ├── uploads/                # Carpeta de archivos subidos
      ├── .env.backup            # Copia del .env
      ├── schema.prisma.backup   # Copia del schema
      ├── backup_info.txt        # Información del backup
      └── backup.log             # Log del proceso
```

## 🔧 Configuración Inicial (Solo la primera vez)

1. **Conectarse al servidor:**
   ```bash
   ssh root@146.190.116.222
   ```

2. **Ir a la carpeta del backend:**
   ```bash
   cd /root/www/html/elebe/backend
   ```

3. **Dar permisos de ejecución a los scripts:**
   ```bash
   chmod +x backup.sh restore.sh
   ```

4. **Verificar que el archivo `.env` existe:**
   ```bash
   ls -la .env
   ```
   
   Si no existe, créalo con:
   ```bash
   cat > .env << 'EOF'
   DATABASE_URL="postgresql://postgres:Gojira2019!@localhost:5432/lb_premium"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV="production"
   FRONTEND_URL="https://elebe.agency"
   EOF
   ```

**Nota:** El directorio `backups/` se crea automáticamente cuando ejecutas el script por primera vez.

## 📝 Ejemplo de Flujo Completo

```bash
# 1. Conectarse al servidor
ssh root@146.190.116.222

# 2. Ir a la carpeta del backend
cd /root/www/html/elebe/backend

# 3. Hacer backup antes del deploy
./backup.sh

# Anota el nombre del backup que te muestra (ejemplo: backup_20251216_233009)

# 4. Hacer el deploy normalmente
git pull origin main
npm install
npm run build
npm run db:migrate

# 5. Si algo sale mal, restaurar:
./restore.sh backup_20251216_233009
# (usa el nombre exacto que anotaste antes)

# 6. Si todo está bien, puedes eliminar backups antiguos después de unos días:
rm -rf backups/backup_20251215_*
```

## 💡 Ventajas sobre Backups de Digital Ocean

Los backups de Digital Ocean son excelentes, pero estos scripts tienen ventajas específicas:

- ✅ **Backups inmediatos antes de deploys** - No esperas al backup diario
- ✅ **Backups de archivos locales** - Incluye `uploads/` y otros archivos que DO no respalda
- ✅ **Restauración rápida** - Restaura en minutos sin esperar a DO
- ✅ **Control total** - Decides cuándo y qué respaldar
- ✅ **Backups específicos** - Puedes nombrarlos según el deploy (ej: `backup_pre_migracion_v2`)

## ⚠️ Notas Importantes

- Los backups incluyen **toda la base de datos**, incluyendo usuarios, sesiones, etc.
- El script de restauración usa `--clean` que **elimina tablas antes de restaurar**
- Los backups **no se comprimen por defecto** (puedes descomentar esa parte si quieres)
- El `.env` no se restaura automáticamente por seguridad (cópialo manualmente si lo necesitas)
- Los backups pueden ser grandes si tienes muchos archivos en `uploads/`
- **Recomendación:** Mantén los backups de Digital Ocean como respaldo principal y usa estos scripts para deploys críticos

## 🗑️ Limpieza de Backups Antiguos

Para mantener el servidor limpio, puedes eliminar backups antiguos:

```bash
# Eliminar backups de más de 7 días
find backups/ -type d -mtime +7 -exec rm -rf {} \;

# O eliminar manualmente
rm -rf backups/backup_20250101_*
```

## 🐛 Solución de Problemas

**Error: "pg_dump: command not found"**
- Ya está instalado en el servidor. Si aparece este error, ejecuta:
  ```bash
  apt-get install -y postgresql-client
  ```

**Error: "Permission denied"**
- Ejecuta: `chmod +x backup.sh restore.sh`

**Error: "No se encontró el archivo .env"**
- Crea el archivo `.env` en `/root/www/html/elebe/backend/` con el contenido de la sección "Configuración Inicial"

**Error: "cannot execute: required file not found"**
- Los archivos tienen formato Windows. Ejecuta:
  ```bash
  sed -i 's/\r$//' backup.sh restore.sh
  ```

**Error al restaurar: "database is being accessed by other users"**
- Detén Docker antes de restaurar:
  ```bash
  cd /root/www/html/elebe
  docker-compose down
  ```
- Luego restaura y vuelve a iniciar Docker:
  ```bash
  docker-compose up -d
  ```

## 🔄 Integración con Digital Ocean

Tu proyecto está en Digital Ocean con backups automáticos diarios. Estos scripts son un complemento:

- **Backups de Digital Ocean:** Se hacen automáticamente todos los días
- **Estos scripts:** Para hacer backup ANTES de cada deploy importante

**Cuándo usar cada uno:**

✅ **Usa estos scripts (`./backup.sh`):**
- Antes de hacer migraciones de base de datos
- Antes de deploys importantes
- Cuando necesitas restaurar rápido (en minutos)

✅ **Usa backups de Digital Ocean:**
- Si descubres un problema días después del deploy
- Si perdiste los backups locales
- Como respaldo de seguridad general

**Resumen:** Los backups de DO son tu red de seguridad. Estos scripts son para restaurar rápido cuando algo sale mal inmediatamente después de un deploy.
