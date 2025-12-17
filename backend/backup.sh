#!/bin/bash

# Script de backup antes de deploy
# Uso: ./backup.sh [nombre-del-backup]

set -e  # Salir si hay algún error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio donde se guardarán los backups
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="${1:-backup_${TIMESTAMP}}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

echo -e "${YELLOW}🔄 Iniciando backup: ${BACKUP_NAME}${NC}"

# Crear directorio de backups si no existe
mkdir -p "${BACKUP_PATH}"

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ Error: No se encontró el archivo .env${NC}"
    exit 1
fi

# Extraer información de conexión de DATABASE_URL
# Formato: postgresql://user:password@host:port/database
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL no está definida en .env${NC}"
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

echo -e "${GREEN}📦 Backup de base de datos...${NC}"
# Backup de PostgreSQL
PGPASSWORD="${DB_PASS}" pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" \
    --format=custom \
    --file="${BACKUP_PATH}/database.dump" \
    --verbose 2>&1 | tee "${BACKUP_PATH}/backup.log"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup de base de datos completado${NC}"
else
    echo -e "${RED}❌ Error al hacer backup de la base de datos${NC}"
    exit 1
fi

# Backup de archivos importantes
echo -e "${GREEN}📁 Backup de archivos...${NC}"

# Backup de uploads si existe
if [ -d "uploads" ]; then
    echo "  - Copiando carpeta uploads..."
    cp -r uploads "${BACKUP_PATH}/uploads" 2>&1 | tee -a "${BACKUP_PATH}/backup.log"
fi

# Backup de .env
if [ -f .env ]; then
    echo "  - Copiando .env..."
    cp .env "${BACKUP_PATH}/.env.backup" 2>&1 | tee -a "${BACKUP_PATH}/backup.log"
fi

# Backup de schema.prisma
if [ -f "prisma/schema.prisma" ]; then
    echo "  - Copiando schema.prisma..."
    cp prisma/schema.prisma "${BACKUP_PATH}/schema.prisma.backup" 2>&1 | tee -a "${BACKUP_PATH}/backup.log"
fi

# Crear archivo de información del backup
cat > "${BACKUP_PATH}/backup_info.txt" << EOF
Backup creado: $(date)
Nombre: ${BACKUP_NAME}
Base de datos: ${DB_NAME}
Host: ${DB_HOST}
Usuario: ${DB_USER}
EOF

echo -e "${GREEN}✅ Backup completado exitosamente!${NC}"
echo -e "${YELLOW}📂 Ubicación: ${BACKUP_PATH}${NC}"
echo -e "${YELLOW}💡 Para restaurar: ./restore.sh ${BACKUP_NAME}${NC}"
