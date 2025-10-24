#!/usr/bin/env bash

# Script de EMERGENCIA para limpiar completamente el entorno Docker
# ⚠️  ADVERTENCIA: ESTE SCRIPT ELIMINARÁ TODOS LOS DATOS
# ⚠️  SOLO USAR EN CASOS EXTREMOS DESPUÉS DE HACER BACKUP

script_dir="$(cd "$(dirname "$0")" && pwd)"

echo "🚨 SCRIPT DE EMERGENCIA - LIMPIEZA COMPLETA"
echo "=========================================="
echo "⚠️  ADVERTENCIA: ESTE SCRIPT ELIMINARÁ TODOS LOS DATOS"
echo "⚠️  Incluyendo la base de datos y todos los volúmenes"
echo ""
echo "¿Estás seguro de que quieres continuar? (escribe 'SI ELIMINAR TODO' para confirmar)"
read -r confirmation

if [ "$confirmation" != "SI ELIMINAR TODO" ]; then
    echo "❌ Operación cancelada por el usuario"
    exit 1
fi

echo ""
echo "💾 Creando backup de emergencia antes de eliminar todo..."
BACKUP_FILE="emergency-backup-$(date +%Y%m%d-%H%M%S).sql"
docker exec lb-premium-db pg_dump -U postgres lb_premium > "/tmp/$BACKUP_FILE" 2>/dev/null || echo "⚠️ No se pudo crear backup (contenedor no disponible)"

echo ""
echo "🧹 Iniciando limpieza completa de emergencia..."

# Parar todos los contenedores y ELIMINAR volúmenes
echo "⏹️ Parando contenedores y eliminando volúmenes..."
docker compose -f "$script_dir/docker-compose.dev.yml" down -v --remove-orphans || docker-compose -f "$script_dir/docker-compose.dev.yml" down -v --remove-orphans || true

# Eliminar imágenes del proyecto
echo "🗑️ Eliminando imágenes del proyecto..."
image_ids=$(docker images | grep -E "lb-premium" | awk '{print $3}' | grep -v "IMAGE" || true)
if [ -n "${image_ids:-}" ]; then
  # shellcheck disable=SC2086
  docker rmi -f $image_ids || true
fi

# Limpiar volúmenes huérfanos
echo "🗂️ Eliminando volúmenes huérfanos..."
docker volume prune -f || true

# Limpiar redes huérfanas
echo "🌐 Limpiando redes..."
docker network prune -f || true

# Limpiar sistema completo
echo "🧽 Limpieza completa del sistema..."
docker system prune -af || true

echo ""
echo "✅ Limpieza de emergencia completada!"
echo "💾 Backup creado en: /tmp/$BACKUP_FILE"
echo "⚠️  TODOS LOS DATOS HAN SIDO ELIMINADOS"
echo "🚀 Puedes ejecutar start-dev-optimized.ps1 para un inicio limpio"
