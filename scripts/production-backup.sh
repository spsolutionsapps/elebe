#!/bin/bash

echo "💾 PRODUCTION DATABASE BACKUP SCRIPT"
echo "===================================="

# Configuración
BACKUP_DIR="/backups"
DB_NAME="lb_premium"
DB_USER="postgres"
CONTAINER_NAME="lb-premium-db"
RETENTION_DAYS=7

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Generar nombre de archivo con timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql"

echo "🔄 Creating backup: $BACKUP_FILE"

# Crear backup
docker exec $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Verificar que el backup se creó correctamente
if [ $? -eq 0 ] && [ -s "$BACKUP_FILE" ]; then
    echo "✅ Backup created successfully"
    echo "📁 File: $BACKUP_FILE"
    echo "📊 Size: $(du -h "$BACKUP_FILE" | cut -f1)"
    
    # Comprimir backup
    gzip "$BACKUP_FILE"
    echo "🗜️ Backup compressed: ${BACKUP_FILE}.gz"
    
    # Limpiar backups antiguos
    echo "🧹 Cleaning old backups (older than $RETENTION_DAYS days)..."
    find $BACKUP_DIR -name "backup_${DB_NAME}_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    echo "✅ Backup process completed successfully"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Mostrar backups disponibles
echo ""
echo "📋 Available backups:"
ls -lah $BACKUP_DIR/backup_${DB_NAME}_*.sql.gz 2>/dev/null || echo "No backups found"
