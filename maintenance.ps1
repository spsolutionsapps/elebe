# 🔧 Script de Mantenimiento - LB Premium CRM
# PowerShell Script para tareas de mantenimiento del sistema

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("backup", "cleanup", "update", "restart", "logs", "health")]
    [string]$Action
)

Write-Host "🔧 Mantenimiento de LB Premium CRM - Acción: $Action" -ForegroundColor Green

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

# Función para crear backup
function Backup-Database {
    Show-Progress "💾 Creando backup de base de datos..."
    
    $backupDir = "backups"
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir
    }
    
    $backupFile = "$backupDir\backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
    
    try {
        docker-compose exec -T db pg_dump -U postgres lb_premium > $backupFile
        Show-Progress "✅ Backup creado: $backupFile" "SUCCESS"
        
        # Comprimir backup
        Compress-Archive -Path $backupFile -DestinationPath "$backupFile.zip"
        Remove-Item $backupFile
        Show-Progress "✅ Backup comprimido: $backupFile.zip" "SUCCESS"
        
        # Limpiar backups antiguos (mantener solo los últimos 7)
        $oldBackups = Get-ChildItem "$backupDir\*.zip" | Sort-Object CreationTime -Descending | Select-Object -Skip 7
        foreach ($oldBackup in $oldBackups) {
            Remove-Item $oldBackup.FullName
            Show-Progress "🗑️ Backup antiguo eliminado: $($oldBackup.Name)" "WARNING"
        }
    }
    catch {
        Show-Progress "❌ Error creando backup: $($_.Exception.Message)" "ERROR"
    }
}

# Función para limpieza
function Cleanup-System {
    Show-Progress "🧹 Iniciando limpieza del sistema..."
    
    # Limpiar contenedores parados
    Show-Progress "Limpiando contenedores parados..."
    docker container prune -f
    
    # Limpiar imágenes no utilizadas
    Show-Progress "Limpiando imágenes no utilizadas..."
    docker image prune -f
    
    # Limpiar volúmenes no utilizados
    Show-Progress "Limpiando volúmenes no utilizados..."
    docker volume prune -f
    
    # Limpiar redes no utilizadas
    Show-Progress "Limpiando redes no utilizadas..."
    docker network prune -f
    
    # Limpiar logs antiguos
    Show-Progress "Limpiando logs antiguos..."
    $logFiles = Get-ChildItem "*.log" -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
    foreach ($logFile in $logFiles) {
        Remove-Item $logFile.FullName
        Show-Progress "🗑️ Log eliminado: $($logFile.Name)" "WARNING"
    }
    
    Show-Progress "✅ Limpieza completada" "SUCCESS"
}

# Función para actualizar
function Update-System {
    Show-Progress "🔄 Actualizando sistema..."
    
    # Crear backup antes de actualizar
    Backup-Database
    
    # Detener servicios
    Show-Progress "Deteniendo servicios..."
    docker-compose down
    
    # Pull de nuevas imágenes
    Show-Progress "Descargando nuevas imágenes..."
    docker-compose pull
    
    # Iniciar servicios
    Show-Progress "Iniciando servicios..."
    docker-compose up -d
    
    # Esperar a que estén listos
    Start-Sleep -Seconds 10
    
    # Ejecutar migraciones
    Show-Progress "Ejecutando migraciones..."
    docker-compose exec backend npx prisma migrate deploy
    
    Show-Progress "✅ Sistema actualizado" "SUCCESS"
}

# Función para reiniciar
function Restart-System {
    Show-Progress "🔄 Reiniciando sistema..."
    
    docker-compose restart
    
    # Esperar a que estén listos
    Start-Sleep -Seconds 10
    
    # Verificar salud
    Show-Progress "Verificando salud de servicios..."
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Show-Progress "✅ Sistema reiniciado correctamente" "SUCCESS"
        } else {
            Show-Progress "⚠️ Sistema reiniciado pero con advertencias" "WARNING"
        }
    }
    catch {
        Show-Progress "❌ Error verificando salud del sistema" "ERROR"
    }
}

# Función para mostrar logs
function Show-Logs {
    Show-Progress "📋 Mostrando logs del sistema..."
    
    Write-Host "`n🐳 Estado de contenedores:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host "`n📋 Logs recientes:" -ForegroundColor Cyan
    docker-compose logs --tail=50 --timestamps
    
    Write-Host "`n💻 Uso de recursos:" -ForegroundColor Cyan
    docker stats --no-stream
}

# Función para verificar salud
function Check-Health {
    Show-Progress "🏥 Verificando salud del sistema..."
    
    $services = @(
        @{ Name = "Frontend"; Url = "http://localhost:3000" },
        @{ Name = "Backend"; Url = "http://localhost:3001/health" }
    )
    
    $allHealthy = $true
    
    foreach ($service in $services) {
        try {
            $response = Invoke-WebRequest -Uri $service.Url -Method GET -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Show-Progress "✅ $($service.Name): OK" "SUCCESS"
            } else {
                Show-Progress "❌ $($service.Name): Error (Status: $($response.StatusCode))" "ERROR"
                $allHealthy = $false
            }
        }
        catch {
            Show-Progress "❌ $($service.Name): No disponible" "ERROR"
            $allHealthy = $false
        }
    }
    
    # Verificar base de datos
    try {
        $dbCheck = docker-compose exec -T db pg_isready -U postgres
        if ($LASTEXITCODE -eq 0) {
            Show-Progress "✅ Base de Datos: OK" "SUCCESS"
        } else {
            Show-Progress "❌ Base de Datos: Error" "ERROR"
            $allHealthy = $false
        }
    }
    catch {
        Show-Progress "❌ Base de Datos: No disponible" "ERROR"
        $allHealthy = $false
    }
    
    if ($allHealthy) {
        Show-Progress "🎉 Sistema completamente saludable" "SUCCESS"
    } else {
        Show-Progress "⚠️ Sistema con problemas de salud" "WARNING"
    }
}

# Ejecutar acción solicitada
switch ($Action) {
    "backup" { Backup-Database }
    "cleanup" { Cleanup-System }
    "update" { Update-System }
    "restart" { Restart-System }
    "logs" { Show-Logs }
    "health" { Check-Health }
}

Write-Host "`n🔧 Mantenimiento completado" -ForegroundColor Green

