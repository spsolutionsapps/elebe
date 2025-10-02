# Script para limpiar completamente el entorno Docker
# Útil cuando hay problemas persistentes

Write-Host "🧹 Limpiando completamente el entorno Docker..." -ForegroundColor Red

# Parar todos los contenedores
Write-Host "⏹️ Parando contenedores..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# Eliminar imágenes del proyecto
Write-Host "🗑️ Eliminando imágenes del proyecto..." -ForegroundColor Yellow
docker images | Select-String "lb-premium" | ForEach-Object { 
    $imageId = ($_ -split '\s+')[2]
    if ($imageId -ne "IMAGE") {
        docker rmi -f $imageId
    }
}

# Limpiar volúmenes huérfanos
Write-Host "🗂️ Limpiando volúmenes..." -ForegroundColor Yellow
docker volume prune -f

# Limpiar redes huérfanas
Write-Host "🌐 Limpiando redes..." -ForegroundColor Yellow
docker network prune -f

# Limpiar sistema completo
Write-Host "🧽 Limpieza completa del sistema..." -ForegroundColor Yellow
docker system prune -af

Write-Host "✅ Limpieza completa terminada!" -ForegroundColor Green
Write-Host "💡 Ahora puedes ejecutar start-dev-optimized.ps1 para un inicio limpio" -ForegroundColor Cyan
