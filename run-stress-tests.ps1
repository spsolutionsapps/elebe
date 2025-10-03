# Script de PowerShell para ejecutar pruebas de estrés del admin
# Ejecuta todas las pruebas de estrés de manera organizada

param(
    [string]$ApiUrl = "http://localhost:3001/api",
    [int]$Duration = 300,  # 5 minutos por defecto
    [switch]$Quick,        # Ejecutar solo pruebas básicas
    [switch]$Advanced,     # Ejecutar solo pruebas avanzadas
    [switch]$Monitor,      # Solo monitoreo de sistema
    [switch]$Help
)

if ($Help) {
    Write-Host @"
🔥 SCRIPT DE PRUEBAS DE ESTRÉS - PANEL ADMIN

USAGE:
    .\run-stress-tests.ps1 [OPTIONS]

OPTIONS:
    -ApiUrl <url>     URL base de la API (default: http://localhost:3001/api)
    -Duration <sec>   Duración del monitoreo en segundos (default: 300)
    -Quick           Ejecutar solo pruebas básicas de estrés
    -Advanced        Ejecutar solo pruebas avanzadas
    -Monitor         Solo ejecutar monitoreo de sistema
    -Help            Mostrar esta ayuda

EJEMPLOS:
    .\run-stress-tests.ps1                    # Ejecutar todas las pruebas
    .\run-stress-tests.ps1 -Quick             # Solo pruebas básicas
    .\run-stress-tests.ps1 -Advanced          # Solo pruebas avanzadas
    .\run-stress-tests.ps1 -Monitor -Duration 600  # Solo monitoreo por 10 min
    .\run-stress-tests.ps1 -ApiUrl "http://192.168.1.100:3001/api"

PREREQUISITOS:
    - Node.js instalado
    - Backend ejecutándose en la URL especificada
    - Credenciales admin configuradas correctamente

"@ -ForegroundColor Cyan
    exit 0
}

# Configurar variables de entorno
$env:API_URL = $ApiUrl

# Colores para output
$colors = @{
    Header = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Info = "White"
}

function Write-Header {
    param([string]$Message)
    Write-Host "`n" -NoNewline
    Write-Host "=" * 80 -ForegroundColor $colors.Header
    Write-Host $Message -ForegroundColor $colors.Header
    Write-Host "=" * 80 -ForegroundColor $colors.Header
}

function Write-Step {
    param([string]$Message)
    Write-Host "`n🚀 $Message" -ForegroundColor $colors.Info
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $colors.Success
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $colors.Warning
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $colors.Error
}

# Verificar prerrequisitos
function Test-Prerequisites {
    Write-Step "Verificando prerrequisitos..."
    
    # Verificar Node.js
    try {
        $nodeVersion = node --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Node.js encontrado: $nodeVersion"
        } else {
            throw "Node.js no encontrado"
        }
    } catch {
        Write-Error "Node.js no está instalado o no está en el PATH"
        exit 1
    }
    
    # Verificar archivos de prueba
    $requiredFiles = @(
        "stress-test-admin.js",
        "stress-test-admin-advanced.js", 
        "stress-test-monitor.js"
    )
    
    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-Success "Archivo encontrado: $file"
        } else {
            Write-Error "Archivo no encontrado: $file"
            exit 1
        }
    }
    
    # Verificar conectividad con la API
    Write-Step "Verificando conectividad con la API..."
    try {
        $response = Invoke-WebRequest -Uri "$ApiUrl/auth/login" -Method POST -Body '{"email":"admin@fashionstyle.com","password":"admin123"}' -ContentType "application/json" -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "API respondiendo correctamente"
        } else {
            Write-Warning "API respondió con código: $($response.StatusCode)"
        }
    } catch {
        Write-Warning "No se pudo conectar con la API en $ApiUrl"
        Write-Host "   Asegúrate de que el backend esté ejecutándose" -ForegroundColor $colors.Warning
        $continue = Read-Host "¿Continuar de todos modos? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            exit 1
        }
    }
}

# Ejecutar pruebas básicas
function Start-BasicStressTest {
    Write-Header "PRUEBAS BÁSICAS DE ESTRÉS"
    
    Write-Step "Iniciando pruebas básicas de estrés..."
    
    try {
        node stress-test-admin.js
        Write-Success "Pruebas básicas completadas"
    } catch {
        Write-Error "Error en pruebas básicas: $_"
        return $false
    }
    
    return $true
}

# Ejecutar pruebas avanzadas
function Start-AdvancedStressTest {
    Write-Header "PRUEBAS AVANZADAS DE ESTRÉS"
    
    Write-Step "Iniciando pruebas avanzadas de estrés..."
    
    try {
        node stress-test-admin-advanced.js
        Write-Success "Pruebas avanzadas completadas"
    } catch {
        Write-Error "Error en pruebas avanzadas: $_"
        return $false
    }
    
    return $true
}

# Ejecutar monitoreo
function Start-SystemMonitor {
    Write-Header "MONITOREO DE SISTEMA"
    
    Write-Step "Iniciando monitoreo de recursos del sistema..."
    Write-Host "   Duración: $Duration segundos" -ForegroundColor $colors.Info
    
    try {
        node stress-test-monitor.js $Duration
        Write-Success "Monitoreo completado"
    } catch {
        Write-Error "Error en monitoreo: $_"
        return $false
    }
    
    return $true
}

# Generar reporte final
function New-FinalReport {
    Write-Header "REPORTE FINAL"
    
    $reportTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    Write-Host @"

📊 RESUMEN DE PRUEBAS DE ESTRÉS
   Fecha: $reportTime
   API URL: $ApiUrl
   Duración total: $(Get-Date -Format "HH:mm:ss")

📁 ARCHIVOS GENERADOS:
"@ -ForegroundColor $colors.Info
    
    # Buscar archivos de reporte generados
    $reportFiles = Get-ChildItem -Path . -Name "stress-test-report-*.json" -ErrorAction SilentlyContinue
    $metricFiles = Get-ChildItem -Path . -Name "stress-test-metrics.json" -ErrorAction SilentlyContinue
    $systemFiles = Get-ChildItem -Path . -Name "system-metrics.json" -ErrorAction SilentlyContinue
    
    if ($reportFiles) {
        foreach ($file in $reportFiles) {
            Write-Host "   📄 $file" -ForegroundColor $colors.Success
        }
    }
    
    if ($metricFiles) {
        foreach ($file in $metricFiles) {
            Write-Host "   📈 $file" -ForegroundColor $colors.Success
        }
    }
    
    if ($systemFiles) {
        foreach ($file in $systemFiles) {
            Write-Host "   💻 $file" -ForegroundColor $colors.Success
        }
    }
    
    Write-Host @"

💡 PRÓXIMOS PASOS:
   1. Revisar los archivos de reporte generados
   2. Analizar métricas de rendimiento
   3. Identificar cuellos de botella
   4. Implementar optimizaciones según los resultados
   5. Programar pruebas regulares de estrés

🔧 COMANDOS ÚTILES:
   - Ver logs del backend: docker-compose logs -f backend
   - Monitorear recursos: node stress-test-monitor.js 60
   - Prueba rápida: .\run-stress-tests.ps1 -Quick

"@ -ForegroundColor $colors.Info
}

# Función principal
function Start-AllStressTests {
    Write-Header "INICIANDO PRUEBAS DE ESTRÉS - PANEL ADMIN"
    
    $startTime = Get-Date
    $successCount = 0
    $totalTests = 0
    
    # Verificar prerrequisitos
    Test-Prerequisites
    
    # Ejecutar pruebas según parámetros
    if ($Monitor) {
        $totalTests = 1
        if (Start-SystemMonitor) { $successCount++ }
    }
    elseif ($Quick) {
        $totalTests = 2
        if (Start-BasicStressTest) { $successCount++ }
        if (Start-SystemMonitor) { $successCount++ }
    }
    elseif ($Advanced) {
        $totalTests = 2
        if (Start-AdvancedStressTest) { $successCount++ }
        if (Start-SystemMonitor) { $successCount++ }
    }
    else {
        $totalTests = 4
        if (Start-BasicStressTest) { $successCount++ }
        if (Start-AdvancedStressTest) { $successCount++ }
        if (Start-SystemMonitor) { $successCount++ }
        
        # Ejecutar monitoreo adicional durante las pruebas avanzadas
        Write-Step "Ejecutando monitoreo adicional..."
        $monitorJob = Start-Job -ScriptBlock { 
            param($duration)
            Set-Location $using:PWD
            node stress-test-monitor.js $duration
        } -ArgumentList $Duration
        
        # Esperar un poco para que el monitoreo capture datos
        Start-Sleep -Seconds 30
        Stop-Job $monitorJob
        Remove-Job $monitorJob
        $successCount++
    }
    
    # Calcular tiempo total
    $endTime = Get-Date
    $totalDuration = $endTime - $startTime
    
    # Generar reporte final
    New-FinalReport
    
    # Resumen final
    Write-Header "RESUMEN FINAL"
    Write-Host @"
   Pruebas ejecutadas: $successCount/$totalTests
   Tiempo total: $($totalDuration.ToString('hh\:mm\:ss'))
   Estado: $(if ($successCount -eq $totalTests) { '✅ COMPLETADO' } else { '⚠️ PARCIAL' })
"@ -ForegroundColor $(if ($successCount -eq $totalTests) { $colors.Success } else { $colors.Warning })
    
    if ($successCount -eq $totalTests) {
        Write-Host "`n🎉 Todas las pruebas completadas exitosamente!" -ForegroundColor $colors.Success
        exit 0
    } else {
        Write-Host "`n⚠️  Algunas pruebas fallaron. Revisa los logs arriba." -ForegroundColor $colors.Warning
        exit 1
    }
}

# Manejo de interrupción
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Write-Host "`n🛑 Pruebas interrumpidas por el usuario" -ForegroundColor $colors.Warning
}

# Ejecutar función principal
try {
    Start-AllStressTests
} catch {
    Write-Error "Error fatal: $_"
    exit 1
}
