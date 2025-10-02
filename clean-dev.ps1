Write-Host "Cleaning development environment..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Stopping containers..." -ForegroundColor Red
docker-compose -f docker-compose.dev.yml down -v

Write-Host ""
Write-Host "Removing containers and images..." -ForegroundColor Red
docker-compose -f docker-compose.dev.yml rm -f

Write-Host ""
Write-Host "Cleaning Docker system..." -ForegroundColor Red
docker system prune -f

Write-Host ""
Write-Host "Development environment cleaned!" -ForegroundColor Green
Write-Host "You can now run: .\start-dev-with-env.ps1" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"
