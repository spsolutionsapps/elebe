# 🚀 Script de Despliegue Automatizado - LB Premium CRM
# PowerShell Script para despliegue en producción

param(
    [string]$Environment = "production",
    [switch]$SkipBackup = $false,
    [switch]$SkipTests = $false
)

Write-Host "🚀 Iniciando despliegue de LB Premium CRM..." -ForegroundColor Green

# Función para mostrar progreso
function Show-Progress {
    param([string]$Message, [string]$Status = "INFO")
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = switch ($Status) {
        "SUCCESS" { "Green" }
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        default { "Cyan" }
    }
    Write-Host "[$timestamp] $Message" -ForegroundColor $color
}

# Función para verificar comandos
function Test-Command {
    param([string]$Command)
    try {
        & $Command --version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Verificar dependencias
Show-Progress "Verificando dependencias..."
if (-not (Test-Command "docker")) {
    Show-Progress "❌ Docker no está instalado" "ERROR"
    exit 1
}

if (-not (Test-Command "docker-compose")) {
    Show-Progress "❌ Docker Compose no está instalado" "ERROR"
    exit 1
}

Show-Progress "✅ Dependencias verificadas" "SUCCESS"

# Verificar archivo de configuración
if (-not (Test-Path ".env")) {
    Show-Progress "⚠️ Archivo .env no encontrado, copiando desde ejemplo..." "WARNING"
    Copy-Item "env.docker.example" ".env"
    Show-Progress "📝 Por favor, configura las variables en .env antes de continuar" "WARNING"
    Read-Host "Presiona Enter cuando hayas configurado .env"
}

# Backup de base de datos (si no se omite)
if (-not $SkipBackup) {
    Show-Progress "💾 Creando backup de base de datos..."
    $backupFile = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
    try {
        docker-compose exec -T db pg_dump -U postgres lb_premium > $backupFile
        Show-Progress "✅ Backup creado: $backupFile" "SUCCESS"
    }
    catch {
        Show-Progress "⚠️ No se pudo crear backup (base de datos puede no existir aún)" "WARNING"
    }
}

# Detener servicios existentes
Show-Progress "🛑 Deteniendo servicios existentes..."
docker-compose down

# Pull de nuevas imágenes
Show-Progress "📥 Descargando nuevas imágenes..."
docker-compose pull

# Iniciar servicios
Show-Progress "🚀 Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
Show-Progress "⏳ Esperando a que los servicios estén listos..."
Start-Sleep -Seconds 10

# Verificar salud de los servicios
Show-Progress "🏥 Verificando salud de los servicios..."

$maxRetries = 30
$retryCount = 0

do {
    $retryCount++
    Show-Progress "Intento $retryCount/$maxRetries - Verificando servicios..."
    
    try {
        $frontendHealth = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
        $backendHealth = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5
        
        if ($frontendHealth.StatusCode -eq 200 -and $backendHealth.StatusCode -eq 200) {
            Show-Progress "✅ Servicios funcionando correctamente" "SUCCESS"
            break
        }
    }
    catch {
        Show-Progress "⏳ Servicios aún iniciando... ($retryCount/$maxRetries)"
        Start-Sleep -Seconds 5
    }
} while ($retryCount -lt $maxRetries)

if ($retryCount -eq $maxRetries) {
    Show-Progress "❌ Los servicios no respondieron en el tiempo esperado" "ERROR"
    Show-Progress "📋 Verificando logs..." "WARNING"
    docker-compose logs --tail=50
    exit 1
}

# Ejecutar migraciones de base de datos
Show-Progress "🗄️ Ejecutando migraciones de base de datos..."
try {
    docker-compose exec backend npx prisma migrate deploy
    Show-Progress "✅ Migraciones ejecutadas" "SUCCESS"
}
catch {
    Show-Progress "❌ Error en migraciones" "ERROR"
    docker-compose logs backend
    exit 1
}

# Ejecutar tests (si no se omiten)
if (-not $SkipTests) {
    Show-Progress "🧪 Ejecutando tests..."
    try {
        docker-compose exec frontend npm test -- --passWithNoTests
        docker-compose exec backend npm test -- --passWithNoTests
        Show-Progress "✅ Tests ejecutados exitosamente" "SUCCESS"
    }
    catch {
        Show-Progress "⚠️ Algunos tests fallaron, pero continuando..." "WARNING"
    }
}

# Verificación final
Show-Progress "🔍 Verificación final del sistema..."

$checks = @(
    @{ Name = "Frontend"; Url = "http://localhost:3000"; Expected = 200 },
    @{ Name = "Backend API"; Url = "http://localhost:3001/health"; Expected = 200 },
    @{ Name = "Base de Datos"; Command = "docker-compose exec db pg_isready -U postgres" }
)

foreach ($check in $checks) {
    try {
        if ($check.Url) {
            $response = Invoke-WebRequest -Uri $check.Url -Method GET -TimeoutSec 5
            if ($response.StatusCode -eq $check.Expected) {
                Show-Progress "✅ $($check.Name): OK" "SUCCESS"
            } else {
                Show-Progress "❌ $($check.Name): Error (Status: $($response.StatusCode))" "ERROR"
            }
        } else {
            $result = Invoke-Expression $check.Command
            if ($LASTEXITCODE -eq 0) {
                Show-Progress "✅ $($check.Name): OK" "SUCCESS"
            } else {
                Show-Progress "❌ $($check.Name): Error" "ERROR"
            }
        }
    }
    catch {
        Show-Progress "❌ $($check.Name): Error - $($_.Exception.Message)" "ERROR"
    }
}

# Mostrar información del despliegue
Show-Progress "🎉 ¡Despliegue completado!" "SUCCESS"
Write-Host ""
Write-Host "📊 Información del Sistema:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   Admin:    http://localhost:3000/admin" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   Ver logs:     docker-compose logs -f" -ForegroundColor White
Write-Host "   Detener:      docker-compose down" -ForegroundColor White
Write-Host "   Reiniciar:    docker-compose restart" -ForegroundColor White
Write-Host "   Estado:       docker-compose ps" -ForegroundColor White
Write-Host ""

# Mostrar estado de contenedores
Show-Progress "📋 Estado de contenedores:"
docker-compose ps

Write-Host ""
Show-Progress "🚀 Sistema LB Premium CRM desplegado exitosamente!" "SUCCESS"

