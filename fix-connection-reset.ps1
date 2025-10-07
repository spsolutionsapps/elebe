# Script para arreglar problemas de ERR_CONNECTION_RESET

Write-Host "🔧 Arreglando problemas de conexión..." -ForegroundColor Yellow

# 1. Limpiar cache de Next.js
Write-Host "🧹 Limpiando cache de Next.js..." -ForegroundColor Blue
docker-compose -f docker-compose.dev.yml down
docker volume rm elebe_frontend_next 2>$null

# 2. Limpiar node_modules cache
Write-Host "🧹 Limpiando cache de node_modules..." -ForegroundColor Blue
docker volume rm elebe_frontend_node_modules 2>$null

# 3. Reiniciar con cache limpio
Write-Host "🔄 Reiniciando con cache limpio..." -ForegroundColor Green
docker-compose -f docker-compose.dev.yml up -d

Write-Host "✅ Problemas de conexión arreglados!" -ForegroundColor Green
Write-Host "🌐 Espera 30 segundos y prueba: http://localhost:3000" -ForegroundColor Cyan
