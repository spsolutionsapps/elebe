# Script para debuggear el error de fetch

Write-Host "Debuggeando el error de fetch..." -ForegroundColor Yellow

Write-Host "`n1. Verificando que Docker esté corriendo:" -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml ps

Write-Host "`n2. Verificando que el backend responda:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/brands/active" -Method GET -TimeoutSec 5
    Write-Host "  ✅ Backend OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Backend Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Verificando que el frontend responda:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "  ✅ Frontend OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Frontend Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Verificando logs del frontend:" -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml logs frontend --tail=10

Write-Host "`n5. Verificando logs del backend:" -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml logs backend --tail=10

Write-Host "`n6. Verificando variables de entorno del frontend:" -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml exec frontend printenv | findstr NEXT_PUBLIC

Write-Host "`n7. Verificando conectividad de red:" -ForegroundColor Cyan
Write-Host "  Probando conectividad desde el contenedor frontend al backend..."
docker-compose -f docker-compose.dev.yml exec frontend curl -s http://backend:3001/api/brands/active | head -c 100

Write-Host "`n`nSi el error persiste, puede ser un problema de:" -ForegroundColor Yellow
Write-Host "- SSR (Server-Side Rendering) ejecutándose en el servidor" -ForegroundColor White
Write-Host "- CORS no configurado correctamente" -ForegroundColor White
Write-Host "- Variables de entorno incorrectas" -ForegroundColor White
Write-Host "- Timing de inicialización de los contenedores" -ForegroundColor White
