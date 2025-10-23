#!/bin/bash

# Script para crear backup de la base de datos
# Uso: ./scripts/create-database-backup.sh [backup_name]

set -e  # Stop on any error

echo "💾 Database Backup Creation"
echo "==========================="

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

# Determinar el nombre del backup
if [ -n "$1" ]; then
    BACKUP_NAME="$1"
else
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
fi

# Crear directorio de backups si no existe
BACKUP_DIR="/tmp/db-backups"
mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/$BACKUP_NAME.sql"

echo "📁 Creando backup: $BACKUP_FILE"

# Crear el backup
echo "⏳ Creando backup de la base de datos..."
docker exec lb-premium-db pg_dump -U postgres lb_premium > "$BACKUP_FILE"

# Verificar que el backup se creó correctamente
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup creado exitosamente!"
    echo "📁 Archivo: $BACKUP_FILE"
    echo "📊 Tamaño: $BACKUP_SIZE"
    
    # Mostrar información del backup
    echo ""
    echo "📋 Información del backup:"
    echo "   - Fecha: $(date)"
    echo "   - Base de datos: lb_premium"
    echo "   - Contenedor: lb-premium-db"
    echo "   - Usuario: postgres"
    
    # Mostrar estadísticas de la base de datos
    echo ""
    echo "📊 Estadísticas de la base de datos:"
    TABLE_COUNT=$(docker exec lb-premium-db psql -U postgres -d lb_premium -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    echo "   - Tablas: $TABLE_COUNT"
    
    # Mostrar las tablas principales
    echo "   - Tablas principales:"
    docker exec lb-premium-db psql -U postgres -d lb_premium -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" | sed 's/^/     * /'
    
    echo ""
    echo "💡 Para restaurar este backup:"
    echo "   ./scripts/restore-database-from-backup.sh $BACKUP_FILE"
    
else
    echo "❌ Error al crear el backup"
    exit 1
fi

# Limpiar backups antiguos (mantener solo los últimos 10)
echo ""
echo "🧹 Limpiando backups antiguos..."
cd "$BACKUP_DIR"
BACKUP_COUNT=$(ls -1 backup-*.sql 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 10 ]; then
    echo "   Eliminando backups antiguos (manteniendo los últimos 10)..."
    ls -1t backup-*.sql | tail -n +11 | xargs rm -f
    echo "   ✅ Limpieza completada"
else
    echo "   ✅ No hay backups antiguos para limpiar"
fi

echo ""
echo "🎉 Proceso de backup completado exitosamente!"
