#!/bin/bash

echo "🚨 EMERGENCY MIGRATION RESET - PRODUCTION"
echo "========================================="
echo "⚠️  WARNING: This will reset migration state completely"
echo "⚠️  Only use if the previous fix didn't work"
echo ""

# Configuración del servidor de producción
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-146.190.116.222}"
APP_PATH="${APP_PATH:-/root/elebe}"

# Función para ejecutar comandos en el servidor de producción
run_on_prod() {
    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "$1"
}

echo "💾 STEP 1: Create emergency backup"
echo "=================================="
BACKUP_FILE="emergency-backup-$(date +%Y%m%d-%H%M%S).sql"
run_on_prod "cd $APP_PATH && docker exec lb-premium-db pg_dump -U postgres lb_premium > /tmp/$BACKUP_FILE && echo 'Backup created: /tmp/$BACKUP_FILE'"

echo ""
echo "🔍 STEP 2: Check current migration table"
echo "========================================"
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c 'SELECT * FROM \"_prisma_migrations\" ORDER BY started_at;'"

echo ""
echo "🗑️ STEP 3: Clear migration table"
echo "================================="
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c 'DELETE FROM \"_prisma_migrations\";'"

echo ""
echo "🔄 STEP 4: Reset migration state"
echo "================================"
run_on_prod "cd $APP_PATH/backend && npx prisma migrate resolve --applied 20250908154619_init"

echo ""
echo "📋 STEP 5: Mark all existing migrations as applied"
echo "=================================================="
# Lista de todas las migraciones que deberían estar aplicadas
MIGRATIONS=(
    "20250908154619_init"
    "20250915163650_add_brands"
    "20250915174931_make_logo_optional"
    "20250917174832_update_service_model"
    "20250922132124_add_category_to_product"
    "20250922173737_add_product_specifications"
    "20250923000542_add_featured_products"
    "20250925155713_add_cart_tables"
    "20251001195955_add_slide_button_fields"
    "20251014093847_add_views_column_to_product"
    "20250103_add_performance_indexes"
    "20250115_add_category_table"
    "20250115_add_newsletter_table"
    "20250115_add_service_model"
)

for migration in "${MIGRATIONS[@]}"; do
    echo "Marking $migration as applied..."
    run_on_prod "cd $APP_PATH/backend && npx prisma migrate resolve --applied $migration"
done

echo ""
echo "✅ STEP 6: Verify final state"
echo "============================="
run_on_prod "cd $APP_PATH/backend && npx prisma migrate status"

echo ""
echo "🔍 STEP 7: Check database schema"
echo "================================"
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c '\dt'"

echo ""
echo "✅ Emergency migration reset completed!"
echo ""
echo "Next steps:"
echo "1. Verify the application works correctly"
echo "2. Test all functionality"
echo "3. Monitor for any issues"
echo ""
echo "Backup location: /tmp/$BACKUP_FILE"
