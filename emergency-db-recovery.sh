#!/bin/bash

echo "🚨 EMERGENCY DATABASE RECOVERY SCRIPT"
echo "====================================="
echo "⚠️  WARNING: This script will attempt to recover production database"
echo ""

# Configuración del servidor de producción
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-146.190.116.222}"
APP_PATH="${APP_PATH:-/root/elebe}"

echo "🔍 Checking production server connection..."
echo "Server: $SERVER_USER@$SERVER_HOST"
echo "App Path: $APP_PATH"
echo ""

# Función para ejecutar comandos en el servidor de producción
run_on_prod() {
    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "$1"
}

echo "📊 STEP 1: Check database status"
echo "================================"
run_on_prod "cd $APP_PATH && docker ps | grep postgres"

echo ""
echo "📋 STEP 2: Check database tables"
echo "================================"
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c '\dt'"

echo ""
echo "📈 STEP 3: Check data counts"
echo "============================"
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c 'SELECT COUNT(*) as services FROM \"Service\"; SELECT COUNT(*) as products FROM \"Product\"; SELECT COUNT(*) as users FROM \"User\";'"

echo ""
echo "🔧 STEP 4: Check migration status"
echo "================================="
run_on_prod "cd $APP_PATH/backend && npx prisma migrate status"

echo ""
echo "💾 STEP 5: Create emergency backup"
echo "=================================="
BACKUP_FILE="emergency-backup-$(date +%Y%m%d-%H%M%S).sql"
run_on_prod "cd $APP_PATH && docker exec lb-premium-db pg_dump -U postgres lb_premium > /tmp/$BACKUP_FILE && echo 'Backup created: /tmp/$BACKUP_FILE'"

echo ""
echo "🔄 STEP 6: Check recent logs"
echo "============================"
run_on_prod "cd $APP_PATH && docker logs lb-premium-db --tail 20"

echo ""
echo "✅ Emergency check completed!"
echo "Review the output above to understand the current state."
echo ""
echo "Next steps:"
echo "1. If data is missing, restore from backup"
echo "2. If migrations failed, fix and reapply"
echo "3. If database is corrupted, restore from backup"
echo ""
echo "To restore data, run: ./restore-production-data.sh"
