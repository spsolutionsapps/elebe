# Script de build seguro que maneja el orden correcto
# Este script evita los errores de conexión durante el build

Write-Host "🚀 Iniciando build seguro del proyecto..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Ejecutar desde la raíz del proyecto." -ForegroundColor Red
    exit 1
}

# 1. Instalar dependencias si es necesario
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias del proyecto raíz..." -ForegroundColor Yellow
    npm install
}

# 2. Build del backend primero
Write-Host "🔧 Construyendo backend..." -ForegroundColor Yellow
Set-Location "backend"
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
    npm install
}

Write-Host "🔨 Compilando backend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en build del backend" -ForegroundColor Red
    exit 1
}

# 3. Volver al directorio raíz
Set-Location ".."

# 4. Build del frontend
Write-Host "🎨 Construyendo frontend..." -ForegroundColor Yellow
Set-Location "frontend"
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
    npm install
}

# Crear archivo .env.local si no existe
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creando archivo .env.local..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env.local"
}

Write-Host "🔨 Compilando frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en build del frontend" -ForegroundColor Red
    exit 1
}

# 5. Volver al directorio raíz
Set-Location ".."

Write-Host "✅ Build completado exitosamente!" -ForegroundColor Green
Write-Host "📁 Archivos generados:" -ForegroundColor Cyan
Write-Host "   - Backend: ./backend/dist/" -ForegroundColor Cyan
Write-Host "   - Frontend: ./frontend/.next/" -ForegroundColor Cyan
