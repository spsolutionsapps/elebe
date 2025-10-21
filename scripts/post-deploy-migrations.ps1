# Script para aplicar migraciones después del deployment
# Este script se ejecuta automáticamente después de cada deployment

Write-Host "=== Aplicando migraciones después del deployment ===" -ForegroundColor Green

# Posibles rutas del proyecto en Digital Ocean
$possiblePaths = @(
    "/var/www/elebe/backend",
    "/home/ubuntu/elebe/backend", 
    "/opt/elebe/backend",
    "C:\inetpub\wwwroot\elebe\backend"
)

$projectPath = $null

# Buscar el directorio del proyecto
foreach ($path in $possiblePaths) {
    if (Test-Path "$path/package.json") {
        $projectPath = $path
        break
    }
}

if (-not $projectPath) {
    Write-Host "Error: No se encontró el directorio del proyecto" -ForegroundColor Red
    Write-Host "Rutas verificadas:" -ForegroundColor Yellow
    foreach ($path in $possiblePaths) {
        Write-Host "  - $path" -ForegroundColor Yellow
    }
    exit 1
}

Write-Host "Proyecto encontrado en: $projectPath" -ForegroundColor Green

# Navegar al directorio del proyecto
Set-Location $projectPath

# Verificar que existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "Error: No se encontró el archivo .env" -ForegroundColor Red
    Write-Host "Asegúrate de que tu configuración de base de datos esté configurada" -ForegroundColor Yellow
    exit 1
}

Write-Host "Verificando conexión a la base de datos..." -ForegroundColor Yellow

# Verificar conexión a la base de datos
try {
    npx prisma db pull --schema-only | Out-Null
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

Write-Host "Verificando estado de las migraciones..." -ForegroundColor Yellow

# Verificar estado de las migraciones
npx prisma migrate status

Write-Host "=== Migraciones completadas ===" -ForegroundColor Green
Write-Host "Tu aplicación debería funcionar correctamente ahora" -ForegroundColor Cyan

# Reiniciar la aplicación si es necesario
if (Get-Command pm2 -ErrorAction SilentlyContinue) {
    Write-Host "Reiniciando aplicación con PM2..." -ForegroundColor Yellow
    pm2 restart all
} elseif (Get-Command systemctl -ErrorAction SilentlyContinue) {
    Write-Host "Reiniciando servicio de la aplicación..." -ForegroundColor Yellow
    sudo systemctl restart elebe-backend
}

Write-Host "Deployment y migraciones completados exitosamente" -ForegroundColor Green
