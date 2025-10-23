#!/bin/bash

# Script para restaurar la base de datos desde un backup
# Uso: ./scripts/restore-database-from-backup.sh [backup_file]

set -e  # Stop on any error

echo "🔄 Database Restore from Backup"
echo "==============================="

# Verificar que Docker esté corriendo
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor, inicia Docker primero."
    exit 1
fi

# Verificar que el contenedor de la base de datos esté corriendo
if ! docker ps | grep -q "lb-premium-db"; then
    echo "❌ El contenedor de la base de datos no está corriendo."
    echo "💡 Ejecuta: docker-compose up -d postgres"
    exit 1
fi

# Determinar el archivo de backup a usar
if [ -n "$1" ]; then
    BACKUP_FILE="$1"
else
    # Buscar el backup más reciente
    BACKUP_FILE=$(ls -t /tmp/backup-*.sql 2>/dev/null | head -1)
    if [ -z "$BACKUP_FILE" ]; then
        echo "❌ No se encontró ningún archivo de backup en /tmp/"
        echo "💡 Archivos disponibles:"
        ls -la /tmp/backup-*.sql 2>/dev/null || echo "   Ninguno encontrado"
        echo ""
        echo "💡 Para crear un backup primero:"
        echo "   docker exec lb-premium-db pg_dump -U postgres lb_premium > /tmp/backup-$(date +%Y%m%d-%H%M%S).sql"
        exit 1
    fi
fi

echo "📁 Usando backup: $BACKUP_FILE"

# Verificar que el archivo de backup existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ El archivo de backup no existe: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  ADVERTENCIA: Esto va a reemplazar completamente la base de datos actual"
echo "⚠️  Asegúrate de que tienes un backup reciente antes de continuar"
echo ""
read -p "¿Continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

# Crear backup de seguridad antes de restaurar
echo "💾 Creando backup de seguridad antes de restaurar..."
SAFETY_BACKUP="/tmp/safety-backup-$(date +%Y%m%d-%H%M%S).sql"
docker exec lb-premium-db pg_dump -U postgres lb_premium > "$SAFETY_BACKUP" || {
    echo "⚠️  No se pudo crear backup de seguridad, pero continuando..."
}
echo "✅ Backup de seguridad creado: $SAFETY_BACKUP"

# Detener la aplicación backend temporalmente
echo "⏸️  Deteniendo backend temporalmente..."
docker-compose stop backend || echo "⚠️  Backend ya estaba detenido"

# Eliminar la base de datos actual y recrearla
echo "🗑️  Eliminando base de datos actual..."
docker exec lb-premium-db psql -U postgres -c "DROP DATABASE IF EXISTS lb_premium;"

echo "🆕 Creando nueva base de datos..."
docker exec lb-premium-db psql -U postgres -c "CREATE DATABASE lb_premium;"

# Restaurar desde el backup
echo "📥 Restaurando datos desde backup..."
docker exec -i lb-premium-db psql -U postgres -d lb_premium < "$BACKUP_FILE"

# Verificar que la restauración fue exitosa
echo "🔍 Verificando restauración..."
TABLE_COUNT=$(docker exec lb-premium-db psql -U postgres -d lb_premium -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "✅ Restauración exitosa! Se encontraron $TABLE_COUNT tablas"
else
    echo "❌ Error en la restauración. No se encontraron tablas."
    echo "💡 Intentando restaurar desde backup de seguridad..."
    docker exec lb-premium-db psql -U postgres -c "DROP DATABASE IF EXISTS lb_premium;"
    docker exec lb-premium-db psql -U postgres -c "CREATE DATABASE lb_premium;"
    docker exec -i lb-premium-db psql -U postgres -d lb_premium < "$SAFETY_BACKUP"
    echo "✅ Restaurado desde backup de seguridad"
fi

# Regenerar cliente de Prisma
echo "🔧 Regenerando cliente de Prisma..."
docker-compose up -d backend
sleep 5
docker exec lb-premium-backend npx prisma generate

echo ""
echo "✅ Restauración completada exitosamente!"
echo "📁 Backup usado: $BACKUP_FILE"
echo "🛡️  Backup de seguridad: $SAFETY_BACKUP"
echo ""
echo "🎉 La aplicación debería estar funcionando ahora"
echo "💡 Verifica que todo funcione correctamente"
