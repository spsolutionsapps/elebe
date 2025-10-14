#!/usr/bin/env bash


# Script para limpiar completamente el entorno Docker (versión POSIX sh/bash)
# Útil cuando hay problemas persistentes

script_dir="$(cd "$(dirname "$0")" && pwd)"

echo "🧹 Limpiando completamente el entorno Docker..."

# Parar todos los contenedores
echo "⏹️ Parando contenedores..."
docker compose -f "$script_dir/docker-compose.dev.yml" down -v --remove-orphans || docker-compose -f "$script_dir/docker-compose.dev.yml" down -v --remove-orphans || true

# Eliminar imágenes del proyecto (filtrando por 'lb-premium')
echo "🗑️ Eliminando imágenes del proyecto..."
# Obtiene los IDs de imagen cuyo repositorio/etiqueta coinciden con 'lb-premium' y los elimina
image_ids=$(docker images | grep -E "lb-premium" | awk '{print $3}' | grep -v "IMAGE" || true)
if [ -n "${image_ids:-}" ]; then
  # shellcheck disable=SC2086
  docker rmi -f $image_ids || true
else
  echo "No se encontraron imágenes que coincidan con 'lb-premium'."
fi

# Limpiar volúmenes huérfanos
echo "🗂️ Limpiando volúmenes..."
docker volume prune -f || true

# Limpiar redes huérfanas
echo "🌐 Limpiando redes..."
docker network prune -f || true

# Limpiar sistema completo
echo "🧽 Limpieza completa del sistema..."
docker system prune -af || true

echo "✅ Limpieza completa terminada!"



