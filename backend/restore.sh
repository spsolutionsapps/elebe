#!/bin/bash

# Script de restauración desde backup
# Uso: ./restore.sh [nombre-del-backup]

set -e  # Salir si hay algún error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BACKUP_DIR="./backups"
BACKUP_NAME="${1}"

if [ -z "$BACKUP_NAME" ]; then
    echo -e "${RED}❌ Error: Debes especificar el nombre del backup${NC}"
    echo "Uso: ./restore.sh [nombre-del-backup]"
    echo ""
    echo "Backups disponibles:"
    ls -1 "${BACKUP_DIR}" 2>/dev/null || echo "  (ninguno)"
    exit 1
fi

BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

if [ ! -d "$BACKUP_PATH" ]; then
    echo -e "${RED}❌ Error: No se encontró el backup: ${BACKUP_NAME}${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  ADVERTENCIA: Esto restaurará la base de datos y archivos desde el backup${NC}"
echo -e "${YELLOW}⚠️  Esto sobrescribirá los datos actuales!${NC}"
read -p "¿Estás seguro? Escribe 'SI' para continuar: " confirm

if [ "$confirm" != "SI" ]; then
    echo "Restauración cancelada"
    exit 0
fi

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ Error: No se encontró el archivo .env${NC}"
    exit 1
fi

# Parsear DATABASE_URL
DB_URL_REGEX="postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+)"
if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    echo -e "${RED}❌ Error: No se pudo parsear DATABASE_URL${NC}"
    exit 1
fi

echo -e "${GREEN}🔄 Restaurando base de datos...${NC}"

# Restaurar base de datos
if [ -f "${BACKUP_PATH}/database.dump" ]; then
    PGPASSWORD="${DB_PASS}" pg_restore -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" \
        --clean \
        --if-exists \
        --verbose \
        "${BACKUP_PATH}/database.dump" 2>&1 | tee "${BACKUP_PATH}/restore.log"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Base de datos restaurada${NC}"
    else
        echo -e "${RED}❌ Error al restaurar la base de datos${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Error: No se encontró database.dump en el backup${NC}"
    exit 1
fi

# Restaurar archivos
echo -e "${GREEN}📁 Restaurando archivos...${NC}"

# Restaurar uploads
if [ -d "${BACKUP_PATH}/uploads" ]; then
    echo "  - Restaurando carpeta uploads..."
    rm -rf uploads
    cp -r "${BACKUP_PATH}/uploads" ./uploads
fi

# Restaurar .env (solo si no existe o como .env.restored)
if [ -f "${BACKUP_PATH}/.env.backup" ]; then
    echo "  - Archivo .env.backup disponible en: ${BACKUP_PATH}/.env.backup"
    echo "    (No se restaura automáticamente por seguridad)"
fi

echo -e "${GREEN}✅ Restauración completada!${NC}"
echo -e "${YELLOW}💡 Revisa los logs en: ${BACKUP_PATH}/restore.log${NC}"
