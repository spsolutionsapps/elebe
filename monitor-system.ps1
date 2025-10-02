# 📊 Script de Monitoreo - LB Premium CRM
# PowerShell Script para monitorear el sistema en producción

param(
    [int]$IntervalSeconds = 30,
    [switch]$Continuous = $false,
    [switch]$ShowLogs = $false
)

Write-Host "📊 Iniciando monitoreo de LB Premium CRM..." -ForegroundColor Green

# Función para mostrar métricas
function Show-Metrics {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "`n🕐 [$timestamp] Métricas del Sistema" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Gray

    # Estado de contenedores
    Write-Host "`n🐳 Estado de Contenedores:" -ForegroundColor Yellow
    docker-compose ps

    # Uso de recursos
    Write-Host "`n💻 Uso de Recursos:" -ForegroundColor Yellow
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

    # Verificar salud de servicios
    Write-Host "`n🏥 Salud de Servicios:" -ForegroundColor Yellow
    
    $services = @(
        @{ Name = "Frontend"; Url = "http://localhost:3000" },
        @{ Name = "Backend"; Url = "http://localhost:3001/health" }
    )

    foreach ($service in $services) {
        try {
            $response = Invoke-WebRequest -Uri $service.Url -Method GET -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host "  ✅ $($service.Name): OK" -ForegroundColor Green
            } else {
                Write-Host "  ❌ $($service.Name): Error (Status: $($response.StatusCode))" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "  ❌ $($service.Name): No disponible" -ForegroundColor Red
        }
    }

    # Verificar base de datos
    try {
        $dbCheck = docker-compose exec -T db pg_isready -U postgres
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Base de Datos: OK" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Base de Datos: Error" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "  ❌ Base de Datos: No disponible" -ForegroundColor Red
    }

    # Espacio en disco
    Write-Host "`n💾 Espacio en Disco:" -ForegroundColor Yellow
    $diskUsage = Get-WmiObject -Class Win32_LogicalDisk | Where-Object {$_.DriveType -eq 3}
    foreach ($disk in $diskUsage) {
        $freeSpace = [math]::Round($disk.FreeSpace / 1GB, 2)
        $totalSpace = [math]::Round($disk.Size / 1GB, 2)
        $usedSpace = $totalSpace - $freeSpace
        $percentUsed = [math]::Round(($usedSpace / $totalSpace) * 100, 1)
        
        $color = if ($percentUsed -gt 90) { "Red" } elseif ($percentUsed -gt 80) { "Yellow" } else { "Green" }
        Write-Host "  $($disk.DeviceID) $usedSpace GB / $totalSpace GB ($percentUsed% usado)" -ForegroundColor $color
    }

    # Logs recientes (si se solicita)
    if ($ShowLogs) {
        Write-Host "`n📋 Logs Recientes:" -ForegroundColor Yellow
        docker-compose logs --tail=10 --timestamps
    }
}

# Función para mostrar alertas
function Show-Alerts {
    $alerts = @()

    # Verificar si los contenedores están corriendo
    $containers = docker-compose ps --services
    foreach ($container in $containers) {
        $status = docker-compose ps $container --format "{{.State}}"
        if ($status -ne "running") {
            $alerts += "⚠️ Contenedor $container no está corriendo (Estado: $status)"
        }
    }

    # Verificar uso de CPU
    $cpuUsage = docker stats --no-stream --format "{{.CPUPerc}}" | ForEach-Object { [double]($_ -replace '%', '') }
    $avgCpu = ($cpuUsage | Measure-Object -Average).Average
    if ($avgCpu -gt 80) {
        $alerts += "🔥 Alto uso de CPU: $([math]::Round($avgCpu, 1))%"
    }

    # Verificar uso de memoria
    $memUsage = docker stats --no-stream --format "{{.MemPerc}}" | ForEach-Object { [double]($_ -replace '%', '') }
    $avgMem = ($memUsage | Measure-Object -Average).Average
    if ($avgMem -gt 85) {
        $alerts += "🧠 Alto uso de memoria: $([math]::Round($avgMem, 1))%"
    }

    if ($alerts.Count -gt 0) {
        Write-Host "`n🚨 ALERTAS:" -ForegroundColor Red
        foreach ($alert in $alerts) {
            Write-Host "  $alert" -ForegroundColor Red
        }
    } else {
        Write-Host "`n✅ Sin alertas - Sistema funcionando correctamente" -ForegroundColor Green
    }
}

# Función principal de monitoreo
function Start-Monitoring {
    do {
        Clear-Host
        Show-Metrics
        Show-Alerts
        
        if ($Continuous) {
            Write-Host "`n⏳ Próxima verificación en $IntervalSeconds segundos..." -ForegroundColor Cyan
            Write-Host "Presiona Ctrl+C para detener el monitoreo" -ForegroundColor Gray
            Start-Sleep -Seconds $IntervalSeconds
        }
    } while ($Continuous)
}

# Manejo de interrupciones
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Write-Host "`n👋 Monitoreo detenido" -ForegroundColor Yellow
}

# Iniciar monitoreo
try {
    Start-Monitoring
}
catch {
    Write-Host "`n❌ Error en el monitoreo: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Write-Host "`n📊 Monitoreo finalizado" -ForegroundColor Cyan
}

