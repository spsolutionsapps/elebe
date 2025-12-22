# Script para solucionar el problema del usuario admin en producción

Write-Host "🔧 Solucionando problema del usuario admin en producción..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (!(Test-Path "docker-compose.yml")) {
    Write-Host "❌ Error: docker-compose.yml no encontrado. Ejecuta desde el directorio raíz del proyecto." -ForegroundColor Red
    exit 1
}

Write-Host "📊 Ejecutando creación del usuario admin..." -ForegroundColor Yellow

try {
    # Ejecutar el comando para crear/fijar el usuario admin
    docker-compose exec backend npm run fix-admin-user

    Write-Host "✅ Usuario admin creado/actualizado exitosamente" -ForegroundColor Green

    # Verificar que el usuario existe
    Write-Host "👤 Verificando usuario creado..." -ForegroundColor Yellow
    docker-compose exec backend npm run check-users

} catch {
    Write-Host "❌ Error al crear el usuario admin: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "" -ForegroundColor White
Write-Host "🎉 Problema solucionado!" -ForegroundColor Green
Write-Host "📧 Email: elebe.merch@gmail.com" -ForegroundColor White
Write-Host "🔑 Contraseña: u1u2u3u4u5" -ForegroundColor White
Write-Host "👤 Rol: admin" -ForegroundColor White
