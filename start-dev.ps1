# Script para iniciar el entorno de desarrollo
# Este script es MUCHO más rápido que docker-compose up -d --build

Write-Host "🚀 Iniciando entorno de desarrollo..." -ForegroundColor Green

# Detener contenedores existentes
Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down

# Iniciar contenedores de desarrollo (SIN rebuild)
Write-Host "▶️ Iniciando contenedores de desarrollo..." -ForegroundColor Blue
docker-compose -f docker-compose.dev.yml up -d

Write-Host "✅ Entorno de desarrollo iniciado!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "📊 Admin: http://localhost:3000/admin" -ForegroundColor Cyan

Write-Host "`n💡 Comandos útiles:" -ForegroundColor Magenta
Write-Host "   Ver logs: docker-compose -f docker-compose.dev.yml logs -f" -ForegroundColor Gray
Write-Host "   Detener: docker-compose -f docker-compose.dev.yml down" -ForegroundColor Gray
Write-Host "   Estado: docker-compose -f docker-compose.dev.yml ps" -ForegroundColor Gray