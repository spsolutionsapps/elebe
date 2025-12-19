#!/bin/sh

echo "🚀 Iniciando contenedor de backend..."

# Verificar si la base de datos está accesible
echo "🔍 Verificando conexión a la base de datos..."
if npx prisma db pull --schema-only > /dev/null 2>&1; then
    echo "✅ Base de datos accesible"

    # Verificar si ya existe el usuario admin
    echo "👤 Verificando usuario administrador..."
    if npx prisma db execute --file <(echo "SELECT id FROM \"User\" WHERE email = 'elebe.agency@gmail.com' LIMIT 1;") > /dev/null 2>&1; then
        echo "✅ Usuario administrador ya existe, omitiendo inicialización"
    else
        echo "📦 Usuario administrador no encontrado, ejecutando inicialización..."
        if npm run init-production; then
            echo "✅ Inicialización completada exitosamente"
        else
            echo "❌ Error durante la inicialización"
            exit 1
        fi
    fi
else
    echo "❌ Base de datos no accesible, esperando..."
    echo "El contenedor se reiniciará automáticamente cuando la base de datos esté lista"
    exit 1
fi

echo "🎯 Iniciando aplicación..."
exec node dist/main.js