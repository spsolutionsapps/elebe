#!/bin/bash

# Script para aplicar migraciones después del deployment en Digital Ocean
# Este script se ejecuta automáticamente después de cada deployment

echo "=== Aplicando migraciones después del deployment ==="

# Navegar al directorio del proyecto
cd /var/www/elebe/backend || cd /home/ubuntu/elebe/backend || cd /opt/elebe/backend

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "Error: No se encontró package.json. Verifica la ruta del proyecto."
    exit 1
fi

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
    echo "Revisa los logs para más detalles"
    exit 1
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
    sudo systemctl restart elebe-backend || sudo systemctl restart elebe
fi

echo "Deployment y migraciones completados exitosamente"
