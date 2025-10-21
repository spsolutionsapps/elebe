# Script para aplicar migraciones en producción
# Ejecutar este script en tu servidor de producción

Write-Host "=== Aplicando migraciones en producción ===" -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "backend")) {
    Write-Host "Error: No se encontró el directorio 'backend'" -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script desde la raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

# Navegar al directorio backend
Set-Location backend

# Verificar que existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "Error: No se encontró el archivo .env" -ForegroundColor Red
    Write-Host "Asegúrate de que tu configuración de base de datos esté en .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "Verificando conexión a la base de datos..." -ForegroundColor Yellow

# Verificar conexión a la base de datos
try {
    npx prisma db pull --schema-only
    Write-Host "✓ Conexión a la base de datos exitosa" -ForegroundColor Green
} catch {
    Write-Host "✗ Error de conexión a la base de datos" -ForegroundColor Red
    Write-Host "Verifica tu configuración en .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "Aplicando migraciones..." -ForegroundColor Yellow

# Aplicar migraciones
try {
    npx prisma migrate deploy
    Write-Host "✓ Migraciones aplicadas exitosamente" -ForegroundColor Green
} catch {
    Write-Host "✗ Error al aplicar migraciones" -ForegroundColor Red
    Write-Host "Revisa los logs para más detalles" -ForegroundColor Yellow
    exit 1
}

Write-Host "Generando cliente de Prisma..." -ForegroundColor Yellow

# Generar cliente de Prisma
try {
    npx prisma generate
    Write-Host "✓ Cliente de Prisma generado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "✗ Error al generar cliente de Prisma" -ForegroundColor Red
    exit 1
}

Write-Host "=== Migraciones completadas ===" -ForegroundColor Green
Write-Host "Tu aplicación debería funcionar correctamente ahora" -ForegroundColor Cyan
