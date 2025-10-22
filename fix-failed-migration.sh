#!/bin/bash

echo "🚨 FIXING FAILED MIGRATION IN PRODUCTION"
echo "========================================"
echo "⚠️  WARNING: This will fix the failed migration issue"
echo ""

# Configuración del servidor de producción
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-146.190.116.222}"
APP_PATH="${APP_PATH:-/root/elebe}"

# Función para ejecutar comandos en el servidor de producción
run_on_prod() {
    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "$1"
}

echo "🔍 STEP 1: Check current migration status"
echo "=========================================="
run_on_prod "cd $APP_PATH/backend && npx prisma migrate status"

echo ""
echo "📊 STEP 2: Check failed migration details"
echo "========================================="
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c 'SELECT * FROM \"_prisma_migrations\" WHERE migration_name = '\''20250908154619_init'\'';'"

echo ""
echo "🔧 STEP 3: Mark failed migration as resolved"
echo "============================================="
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c 'UPDATE \"_prisma_migrations\" SET finished_at = NOW(), logs = '\''Manually resolved'\'' WHERE migration_name = '\''20250908154619_init'\'' AND finished_at IS NULL;'"

echo ""
echo "🔄 STEP 4: Reset migration status"
echo "================================="
run_on_prod "cd $APP_PATH/backend && npx prisma migrate resolve --applied 20250908154619_init"

echo ""
echo "✅ STEP 5: Verify migration status"
echo "=================================="
run_on_prod "cd $APP_PATH/backend && npx prisma migrate status"

echo ""
echo "🚀 STEP 6: Apply pending migrations"
echo "==================================="
run_on_prod "cd $APP_PATH/backend && npx prisma migrate deploy"

echo ""
echo "🔍 STEP 7: Final verification"
echo "============================="
run_on_prod "cd $APP_PATH/backend && npx prisma migrate status"

echo ""
echo "✅ Migration fix completed!"
echo ""
echo "If there are still issues, you may need to:"
echo "1. Check the database schema manually"
echo "2. Reset the migration table completely"
echo "3. Recreate the database from scratch"
