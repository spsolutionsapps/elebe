# Script para levantar Docker con las variables de entorno correctas
# Este script evita el problema de "fetch failed" configurando las variables correctas

Write-Host "🐳 Configurando variables de entorno para Docker..." -ForegroundColor Green

# Configurar variables de entorno para Docker
$env:NEXT_PUBLIC_API_URL="http://backend:3001/api"
$env:NEXT_PUBLIC_BACKEND_URL="http://backend:3001"
$env:NEXT_PUBLIC_ENV="development"

Write-Host "✅ Variables configuradas:" -ForegroundColor Green
Write-Host "   NEXT_PUBLIC_API_URL: $env:NEXT_PUBLIC_API_URL" -ForegroundColor Cyan
Write-Host "   NEXT_PUBLIC_BACKEND_URL: $env:NEXT_PUBLIC_BACKEND_URL" -ForegroundColor Cyan
Write-Host "   NEXT_PUBLIC_ENV: $env:NEXT_PUBLIC_ENV" -ForegroundColor Cyan

Write-Host "🚀 Levantando contenedores Docker..." -ForegroundColor Green

# Levantar contenedores
docker-compose -f docker-compose.dev.yml up -d

Write-Host "⏳ Esperando que los contenedores estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "🔍 Verificando estado de los contenedores..." -ForegroundColor Green
docker-compose -f docker-compose.dev.yml ps

Write-Host "🌐 Verificando variables de entorno en el frontend..." -ForegroundColor Green
docker-compose -f docker-compose.dev.yml exec frontend printenv | findstr NEXT_PUBLIC

Write-Host "✅ ¡Docker levantado correctamente!" -ForegroundColor Green
Write-Host "🌍 Frontend disponible en: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend disponible en: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🗄️ Prisma Studio disponible en: http://localhost:5555" -ForegroundColor Cyan

Write-Host ""
Write-Host "Para detener los contenedores, ejecuta:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.dev.yml down" -ForegroundColor White
