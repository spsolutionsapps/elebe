# Script de deployment automático con migraciones
# Este script se ejecuta automáticamente después del deployment

Write-Host "=== Deployment Automático con Migraciones ===" -ForegroundColor Green

# Configuración del servidor
$SERVER_IP = "146.190.116.222"
$SERVER_USER = "root"  # Cambia por tu usuario
$PROJECT_PATH = "/var/www/elebe"  # Cambia por tu ruta

Write-Host "Conectando al servidor: $SERVER_IP" -ForegroundColor Cyan

# Comando para ejecutar en el servidor remoto
$REMOTE_COMMAND = @"
cd $PROJECT_PATH/backend
echo 'Aplicando migraciones...'
npx prisma migrate deploy
echo 'Generando cliente de Prisma...'
npx prisma generate
echo 'Reiniciando aplicación...'
pm2 restart all
echo 'Migraciones aplicadas exitosamente'
"@

# Ejecutar comando remoto
try {
    Write-Host "Ejecutando migraciones en el servidor..." -ForegroundColor Yellow
    
    # Opción 1: Usando SSH directo
    ssh $SERVER_USER@$SERVER_IP $REMOTE_COMMAND
    
    Write-Host "✓ Migraciones aplicadas exitosamente" -ForegroundColor Green
    Write-Host "✓ Aplicación reiniciada" -ForegroundColor Green
    Write-Host "✓ Tu aplicación debería funcionar ahora" -ForegroundColor Cyan
    
} catch {
    Write-Host "✗ Error al ejecutar migraciones remotamente" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternativas:" -ForegroundColor Yellow
    Write-Host "1. Conectarte manualmente por SSH" -ForegroundColor White
    Write-Host "2. Usar GitHub Actions (automático)" -ForegroundColor White
    Write-Host "3. Usar el panel de control de Digital Ocean" -ForegroundColor White
}

Write-Host ""
Write-Host "Verifica tu aplicación en: http://$SERVER_IP:3002" -ForegroundColor Cyan
