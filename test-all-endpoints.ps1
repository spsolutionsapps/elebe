# Script para verificar que todos los endpoints estén funcionando

Write-Host "Verificando todos los endpoints del backend..." -ForegroundColor Yellow

$endpoints = @(
    "http://localhost:3001/api/slides",
    "http://localhost:3001/api/products", 
    "http://localhost:3001/api/services",
    "http://localhost:3001/api/brands/active"
)

$allWorking = $true

foreach ($endpoint in $endpoints) {
    try {
        Write-Host "Probando: $endpoint" -ForegroundColor Cyan
        $response = Invoke-WebRequest -Uri $endpoint -Method GET -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ OK (Status: $($response.StatusCode))" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Error (Status: $($response.StatusCode))" -ForegroundColor Red
            $allWorking = $false
        }
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        $allWorking = $false
    }
}

Write-Host "`nVerificando frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ Frontend OK (Status: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Frontend Error (Status: $($response.StatusCode))" -ForegroundColor Red
        $allWorking = $false
    }
} catch {
    Write-Host "  ❌ Frontend Error: $($_.Exception.Message)" -ForegroundColor Red
    $allWorking = $false
}

if ($allWorking) {
    Write-Host "`n🎉 ¡Todos los endpoints están funcionando correctamente!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ Algunos endpoints tienen problemas. Revisa los errores arriba." -ForegroundColor Yellow
}
