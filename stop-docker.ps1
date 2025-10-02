# Script de PowerShell para detener Docker
Write-Host "🛑 Deteniendo LB Premium..." -ForegroundColor Red
Write-Host ""

docker-compose down

Write-Host ""
Write-Host "✅ Servicios detenidos!" -ForegroundColor Green
Write-Host ""
Read-Host "Presiona Enter para continuar"
