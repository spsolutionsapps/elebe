# Script de PowerShell para iniciar Docker
Write-Host "🐳 Iniciando LB Premium con Docker..." -ForegroundColor Cyan
Write-Host ""

# Verificar si existe archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Archivo .env no encontrado. Usando valores por defecto..." -ForegroundColor Yellow
    Write-Host "💡 Para personalizar, copia env.docker.example a .env y modifica los valores" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "📦 Construyendo y iniciando servicios..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host ""
Write-Host "✅ Servicios iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs de acceso:" -ForegroundColor Blue
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001/api" -ForegroundColor White
Write-Host "   Database: localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "📊 Para ver logs: docker-compose logs -f" -ForegroundColor Magenta
Write-Host "🛑 Para parar: docker-compose down" -ForegroundColor Red
Write-Host "⚙️  Para personalizar: copia env.docker.example a .env" -ForegroundColor Cyan
Write-Host ""
Read-Host "Presiona Enter para continuar"
