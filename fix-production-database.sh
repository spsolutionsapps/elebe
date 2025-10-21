#!/bin/bash

# Script para aplicar migraciones en producción - Digital Ocean
# Ejecutar este script en tu servidor de producción

echo "=== Aplicando migraciones en producción ==="
echo "Servidor: 146.190.116.222:3002"

# Verificar que estamos en el directorio correcto
POSSIBLE_PATHS=(
    "/var/www/elebe/backend"
    "/home/ubuntu/elebe/backend"
    "/opt/elebe/backend"
    "/root/elebe/backend"
)

PROJECT_PATH=""

# Buscar el directorio del proyecto
for path in "${POSSIBLE_PATHS[@]}"; do
    if [ -f "$path/package.json" ]; then
        PROJECT_PATH="$path"
        break
    fi
done

if [ -z "$PROJECT_PATH" ]; then
    echo "Error: No se encontró el directorio del proyecto"
    echo "Rutas verificadas:"
    for path in "${POSSIBLE_PATHS[@]}"; do
        echo "  - $path"
    done
    echo ""
    echo "Por favor, navega al directorio correcto y ejecuta:"
    echo "cd /ruta/a/tu/proyecto/elebe/backend"
    exit 1
fi

echo "Proyecto encontrado en: $PROJECT_PATH"

# Navegar al directorio del proyecto
cd "$PROJECT_PATH"

# Verificar que existe el archivo .env
if [ ! -f ".env" ]; then
    echo "Error: No se encontró el archivo .env"
    echo "Asegúrate de que tu configuración de base de datos esté configurada"
    exit 1
fi

echo "Verificando conexión a la base de datos..."

# Verificar conexión a la base de datos
if npx prisma db pull --schema-only > /dev/null 2>&1; then
    echo "✓ Conexión a la base de datos exitosa"
else
    echo "✗ Error de conexión a la base de datos"
    echo "Verifica tu configuración en .env"
    exit 1
fi

echo "Aplicando migraciones..."

# Aplicar migraciones
if npx prisma migrate deploy; then
    echo "✓ Migraciones aplicadas exitosamente"
else
    echo "✗ Error al aplicar migraciones"
    echo ""
    echo "Intentando aplicar migraciones manualmente..."
    
    # Intentar aplicar la migración de Category manualmente
    if [ -f "prisma/migrations/20250115_add_category_table/migration.sql" ]; then
        echo "Creando tabla Category manualmente..."
        if npx prisma db execute --file prisma/migrations/20250115_add_category_table/migration.sql; then
            echo "✓ Tabla Category creada manualmente"
        else
            echo "✗ Error al crear tabla Category manualmente"
            exit 1
        fi
    else
        echo "✗ No se encontró el archivo de migración"
        exit 1
    fi
fi

echo "Generando cliente de Prisma..."

# Generar cliente de Prisma
if npx prisma generate; then
    echo "✓ Cliente de Prisma generado exitosamente"
else
    echo "✗ Error al generar cliente de Prisma"
    exit 1
fi

echo "Verificando estado de las migraciones..."

# Verificar estado de las migraciones
npx prisma migrate status

echo "=== Migraciones completadas ==="
echo "Tu aplicación debería funcionar correctamente ahora"

# Reiniciar la aplicación si es necesario
if command -v pm2 &> /dev/null; then
    echo "Reiniciando aplicación con PM2..."
    pm2 restart all
elif command -v systemctl &> /dev/null; then
    echo "Reiniciando servicio de la aplicación..."
    sudo systemctl restart elebe-backend
else
    echo "⚠️  No se pudo reiniciar la aplicación automáticamente"
    echo "Por favor, reinicia tu aplicación manualmente"
fi

echo ""
echo "🎉 ¡Proceso completado!"
echo "Verifica que tu aplicación funcione en: http://146.190.116.222:3002"
