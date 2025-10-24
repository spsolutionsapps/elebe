# Script para limpiar el entorno Docker de forma SEGURA
# Preserva los datos de la base de datos y otros volúmenes importantes

Write-Host "🧹 Limpiando entorno Docker de forma SEGURA..." -ForegroundColor Green
Write-Host "✅ Los datos de la base de datos se preservarán" -ForegroundColor Green

# Parar todos los contenedores (SIN eliminar volúmenes)
Write-Host "⏹️ Parando contenedores..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down --remove-orphans

# Eliminar imágenes del proyecto
Write-Host "🗑️ Eliminando imágenes del proyecto..." -ForegroundColor Yellow
docker images | Select-String "lb-premium" | ForEach-Object { 
    $imageId = ($_ -split '\s+')[2]
    if ($imageId -ne "IMAGE") {
        docker rmi -f $imageId
    }
}

# Limpiar contenedores parados
Write-Host "🗑️ Limpiando contenedores parados..." -ForegroundColor Yellow
docker container prune -f

# Limpiar imágenes no utilizadas
Write-Host "🗑️ Limpiando imágenes no utilizadas..." -ForegroundColor Yellow
docker image prune -f

# Limpiar volúmenes huérfanos (EXCLUYENDO volúmenes de datos importantes)
Write-Host "🗂️ Limpiando volúmenes huérfanos (preservando datos de BD)..." -ForegroundColor Yellow
docker volume prune -f --filter "label!=keep-data"

# Limpiar redes huérfanas
Write-Host "🌐 Limpiando redes..." -ForegroundColor Yellow
docker network prune -f

# Limpiar sistema (sin forzar eliminación de volúmenes)
Write-Host "🧽 Limpieza del sistema..." -ForegroundColor Yellow
docker system prune -f

Write-Host "✅ Limpieza SEGURA completada!" -ForegroundColor Green
Write-Host "💾 Los datos de la base de datos se han preservado" -ForegroundColor Green
Write-Host "🚀 Puedes ejecutar start-dev-optimized.ps1 para un inicio limpio" -ForegroundColor Cyan
