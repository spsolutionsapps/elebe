#!/usr/bin/env bash

# Script para limpiar el entorno Docker de forma SEGURA
# Preserva los datos de la base de datos y otros volúmenes importantes

script_dir="$(cd "$(dirname "$0")" && pwd)"

echo "🧹 Limpiando entorno Docker de forma SEGURA..."
echo "✅ Los datos de la base de datos se preservarán"

# Parar todos los contenedores (SIN eliminar volúmenes)
echo "⏹️ Parando contenedores..."
docker compose -f "$script_dir/docker-compose.dev.yml" down --remove-orphans || docker-compose -f "$script_dir/docker-compose.dev.yml" down --remove-orphans || true

# Eliminar imágenes del proyecto (filtrando por 'lb-premium')
echo "🗑️ Eliminando imágenes del proyecto..."
image_ids=$(docker images | grep -E "lb-premium" | awk '{print $3}' | grep -v "IMAGE" || true)
if [ -n "${image_ids:-}" ]; then
  # shellcheck disable=SC2086
  docker rmi -f $image_ids || true
else
  echo "No se encontraron imágenes que coincidan con 'lb-premium'."
fi

# Limpiar contenedores parados
echo "🗑️ Limpiando contenedores parados..."
docker container prune -f || true

# Limpiar imágenes no utilizadas
echo "🗑️ Limpiando imágenes no utilizadas..."
docker image prune -f || true

# Limpiar volúmenes huérfanos (EXCLUYENDO volúmenes de datos importantes)
echo "🗂️ Limpiando volúmenes huérfanos (preservando datos de BD)..."
docker volume prune -f --filter "label!=keep-data" || true

# Limpiar redes huérfanas
echo "🌐 Limpiando redes..."
docker network prune -f || true

# Limpiar sistema (sin forzar eliminación de volúmenes)
echo "🧽 Limpieza del sistema..."
docker system prune -f || true

echo "✅ Limpieza SEGURA completada!"
echo "💾 Los datos de la base de datos se han preservado"
echo "🚀 Puedes ejecutar start-dev-optimized.ps1 para un inicio limpio"
