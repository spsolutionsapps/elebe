Write-Host "Starting LB Premium in Development Mode..." -ForegroundColor Green
Write-Host ""

Write-Host "Setting environment variables..." -ForegroundColor Yellow
$env:NEXT_PUBLIC_API_URL = "http://localhost:3001/api"
$env:NEXT_PUBLIC_BACKEND_URL = "http://localhost:3001"

Write-Host "Starting services with hot reload..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up --build

Write-Host ""
Write-Host "Development environment is ready!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Database: localhost:5432" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"
