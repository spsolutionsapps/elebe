# Script para construir la aplicación con Docker
Write-Host "🚀 Iniciando build de Docker para LB Premium..." -ForegroundColor Green

# Verificar que Docker esté ejecutándose
Write-Host "📋 Verificando Docker..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✅ Docker está ejecutándose" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está ejecutándose. Por favor, inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

# Compilar backend
Write-Host "🔨 Compilando backend..." -ForegroundColor Yellow
Set-Location backend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error compilando backend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend compilado correctamente" -ForegroundColor Green
Set-Location ..

# Limpiar contenedores y volúmenes existentes
Write-Host "🧹 Limpiando contenedores existentes..." -ForegroundColor Yellow
docker-compose down -v --remove-orphans

# Construir y ejecutar con Docker Compose
Write-Host "🐳 Construyendo y ejecutando con Docker Compose..." -ForegroundColor Yellow
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Aplicación construida y ejecutándose correctamente!" -ForegroundColor Green
    Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "🗄️  Base de datos: localhost:5432" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error en el build de Docker" -ForegroundColor Red
    Write-Host "📋 Revisa los logs con: docker-compose logs" -ForegroundColor Yellow
}
