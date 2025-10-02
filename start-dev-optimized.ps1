# Script optimizado para desarrollo LB Premium
# Este script limpia contenedores anteriores y inicia el entorno de desarrollo

Write-Host "🚀 Iniciando entorno de desarrollo LB Premium..." -ForegroundColor Green

# Limpiar contenedores y volúmenes anteriores
Write-Host "🧹 Limpiando contenedores anteriores..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# Limpiar imágenes huérfanas
Write-Host "🗑️ Limpiando imágenes huérfanas..." -ForegroundColor Yellow
docker image prune -f

# Construir e iniciar servicios
Write-Host "🔨 Construyendo e iniciando servicios..." -ForegroundColor Blue
docker-compose -f docker-compose.dev.yml up --build

Write-Host "✅ Entorno de desarrollo iniciado!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🗄️ Base de datos: localhost:5432" -ForegroundColor Cyan
