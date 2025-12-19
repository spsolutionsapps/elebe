# Script completo de despliegue para producción
# Incluye inicialización automática de base de datos y usuario admin

Write-Host "🚀 Iniciando despliegue completo de producción..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (!(Test-Path "docker-compose.yml")) {
    Write-Host "❌ Error: docker-compose.yml no encontrado. Ejecuta desde el directorio raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar variables de entorno
if (!(Test-Path ".env")) {
    Write-Host "❌ Error: Archivo .env no encontrado. Crea el archivo de configuración." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Verificando configuración..." -ForegroundColor Yellow

# Backup de base de datos si existe
Write-Host "💾 Realizando backup de base de datos..." -ForegroundColor Yellow
try {
    docker-compose exec postgres pg_dump -U postgres lb_premium > "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql" 2>$null
    Write-Host "✅ Backup completado" -ForegroundColor Green
} catch {
    Write-Host "⚠️ No se pudo hacer backup (base de datos vacía o no accesible)" -ForegroundColor Yellow
}

# Detener servicios existentes
Write-Host "🛑 Deteniendo servicios existentes..." -ForegroundColor Yellow
docker-compose down

# Actualizar imágenes
Write-Host "📦 Actualizando imágenes..." -ForegroundColor Yellow
docker-compose pull

# Iniciar servicios (la inicialización se ejecuta automáticamente)
Write-Host "🏃 Iniciando servicios con inicialización automática..." -ForegroundColor Yellow
docker-compose up -d

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar estado de los servicios
Write-Host "🔍 Verificando estado de servicios..." -ForegroundColor Yellow
docker-compose ps

# Verificar inicialización
Write-Host "📊 Verificando inicialización de base de datos..." -ForegroundColor Yellow
try {
    $initLogs = docker-compose logs backend 2>$null | Select-String -Pattern "(inicialización|migraciones|usuario administrador|migraciones completadas|Seed completado)" -AllMatches
    if ($initLogs) {
        Write-Host "✅ Inicialización completada:" -ForegroundColor Green
        $initLogs | ForEach-Object { Write-Host "   $($_.Line)" -ForegroundColor Green }
    } else {
        Write-Host "⚠️ No se encontraron logs de inicialización. Verifica manualmente." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ No se pudieron verificar los logs de inicialización" -ForegroundColor Yellow
}

# Verificar usuario admin
Write-Host "👤 Verificando usuario administrador..." -ForegroundColor Yellow
try {
    docker-compose exec backend npm run check-users 2>$null
} catch {
    Write-Host "⚠️ No se pudo verificar el usuario admin. Revisa los logs del backend." -ForegroundColor Yellow
}

# Verificar health checks
Write-Host "🏥 Verificando health checks..." -ForegroundColor Yellow
try {
    $backendHealth = docker-compose exec backend wget --no-verbose --tries=1 --spider http://localhost:3001/health 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend health check: OK" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend health check: FAILED" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ No se pudo verificar health check del backend" -ForegroundColor Yellow
}

Write-Host "" -ForegroundColor White
Write-Host "🎉 Despliegue completado!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📋 Resumen:" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000 (o tu dominio configurado)" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:3002" -ForegroundColor White
Write-Host "👑 Admin Login:" -ForegroundColor White
Write-Host "   📧 Email: $($env:ADMIN_EMAIL ?? 'admin@elebe.com')" -ForegroundColor White
Write-Host "   🔑 Password: [configurado en .env]" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "📊 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   Ver estado: docker-compose ps" -ForegroundColor White
Write-Host "   Reiniciar: docker-compose restart" -ForegroundColor White
Write-Host "   Detener: docker-compose down" -ForegroundColor White