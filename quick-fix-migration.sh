#!/bin/bash

echo "🚨 QUICK FIX FOR FAILED MIGRATION"
echo "=================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

cd backend

echo "🔍 Current migration status:"
npx prisma migrate status

echo ""
echo "🔧 Fixing failed migration..."

# Opción 1: Marcar la migración fallida como resuelta
echo "Marking failed migration as resolved..."
npx prisma migrate resolve --applied 20250908154619_init

echo ""
echo "🔄 Checking status again:"
npx prisma migrate status

echo ""
echo "🚀 Applying pending migrations..."
npx prisma migrate deploy

echo ""
echo "✅ Final status:"
npx prisma migrate status

echo ""
echo "🎉 Migration fix completed!"
echo ""
echo "If this didn't work, try the emergency reset script:"
echo "./reset-migrations-emergency.sh"
