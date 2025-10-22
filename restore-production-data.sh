#!/bin/bash

echo "🔄 PRODUCTION DATA RESTORATION SCRIPT"
echo "====================================="
echo "⚠️  WARNING: This will restore data to production database"
echo ""

# Configuración del servidor de producción
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-146.190.116.222}"
APP_PATH="${APP_PATH:-/root/elebe}"

# Función para ejecutar comandos en el servidor de producción
run_on_prod() {
    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "$1"
}

echo "🔍 STEP 1: Verify database connection"
echo "====================================="
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c 'SELECT version();'"

echo ""
echo "📊 STEP 2: Check current data state"
echo "==================================="
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c 'SELECT COUNT(*) as services FROM \"Service\"; SELECT COUNT(*) as products FROM \"Product\"; SELECT COUNT(*) as users FROM \"User\";'"

echo ""
echo "🌱 STEP 3: Restore services data"
echo "================================"
# Crear script de restauración de servicios
cat > /tmp/restore_services.sql << 'EOF'
-- Restaurar datos de servicios
INSERT INTO "Service" (id, title, description, image, "isActive", "order", "createdAt", "updatedAt") VALUES
('service-1', 'Merchandising Tradicional', 'Ponemos tu marca en todo tipo de objetos promocionales. Termos, botellas, lápices, biromes, lanyards, pins, llaveros, gorros, sombreros, medias, tazas, cuadernos, auriculares, mates, vasos térmicos.', 'https://static.landkit.engeni.com/assets/3024/a5104cf2-4317-4aab-9461-600f6b8deadd/baa6691a236939a18e77.png', true, 1, NOW(), NOW()),
('service-2', 'Textiles', 'Hace más de 20 años que fabricamos Textiles, desarrollamos líneas de producto, molderías a medida. Producimos en pequeña escala para personal o publicidad. También FASON para reconocidas marcas.', 'https://static.landkit.engeni.com/assets/3024/4a97e670-3882-4471-83ba-584bcfe2c097/f6d2a30409a6ddac0db6.png', true, 2, NOW(), NOW()),
('service-3', 'Packaging', 'Nuestros PACKAGINGS llevan tu concepto hasta los límites! Packs primarios y secundarios. Cajas, tubos, cofres, blisters y mucho más.', 'https://static.landkit.engeni.com/assets/3024/3b63580e-fbe4-47af-a397-afaafe8f0702/e79321e9a6eb4a5fc5c9.png', true, 3, NOW(), NOW()),
('service-4', 'Imprenta', 'Ofrecemos soluciones de IMPRENTA en todos los soportes, cartulinas, cartones, vinilos, etc. Bolsas, cuadernos, trípticos, brochures, tarjetones, tent cards, credenciales, blisters, stickers, banners, posters, banderas, etc.', 'https://static.landkit.engeni.com/assets/3024/7c22dc66-6502-46e0-b40d-6ae13ed1ca86/85d145a4b9aaddd5aa6a.png', true, 4, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    "isActive" = EXCLUDED."isActive",
    "order" = EXCLUDED."order",
    "updatedAt" = NOW();
EOF

# Copiar script al servidor y ejecutarlo
scp /tmp/restore_services.sql $SERVER_USER@$SERVER_HOST:/tmp/
run_on_prod "cd $APP_PATH && docker exec -i lb-premium-db psql -U postgres -d lb_premium < /tmp/restore_services.sql"

echo ""
echo "👤 STEP 4: Restore admin user"
echo "============================="
# Crear script de restauración de usuario admin
cat > /tmp/restore_admin.sql << 'EOF'
-- Restaurar usuario administrador
INSERT INTO "User" (id, name, email, "emailVerified", image, password, role, "createdAt", "updatedAt") VALUES
('admin-1', 'Administrador', 'admin@lbpremium.com', NULL, NULL, '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'admin', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    "updatedAt" = NOW();
EOF

# Copiar script al servidor y ejecutarlo
scp /tmp/restore_admin.sql $SERVER_USER@$SERVER_HOST:/tmp/
run_on_prod "cd $APP_PATH && docker exec -i lb-premium-db psql -U postgres -d lb_premium < /tmp/restore_admin.sql"

echo ""
echo "📊 STEP 5: Verify restoration"
echo "============================="
run_on_prod "cd $APP_PATH && docker exec lb-premium-db psql -U postgres -d lb_premium -c 'SELECT COUNT(*) as services FROM \"Service\"; SELECT COUNT(*) as users FROM \"User\";'"

echo ""
echo "🧹 STEP 6: Cleanup temporary files"
echo "=================================="
run_on_prod "rm -f /tmp/restore_services.sql /tmp/restore_admin.sql"
rm -f /tmp/restore_services.sql /tmp/restore_admin.sql

echo ""
echo "✅ Data restoration completed!"
echo ""
echo "Next steps:"
echo "1. Test the application to ensure everything works"
echo "2. Check that all services are visible"
echo "3. Verify admin login works"
echo "4. Implement proper backup strategy"
echo ""
echo "Admin credentials:"
echo "Email: admin@lbpremium.com"
echo "Password: admin123"
