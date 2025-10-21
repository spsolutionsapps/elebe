# Script to fix Category table in production
# This script will apply the Category table creation to your production database

Write-Host "Fixing Category table in production database..." -ForegroundColor Green

# Check if we're in the backend directory
if (-not (Test-Path "backend")) {
    Write-Host "Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Navigate to backend directory
Set-Location backend

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found in backend directory" -ForegroundColor Red
    Write-Host "Please make sure your production database connection is configured in .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "Applying Category table migration..." -ForegroundColor Yellow

# Option 1: Use Prisma migrate deploy (recommended for production)
Write-Host "Option 1: Using Prisma migrate deploy (recommended for production)" -ForegroundColor Cyan
Write-Host "This will apply all pending migrations to production" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run this command:" -ForegroundColor White
Write-Host "npx prisma migrate deploy" -ForegroundColor Green
Write-Host ""

# Option 2: Direct SQL execution
Write-Host "Option 2: Direct SQL execution (if migrate deploy doesn't work)" -ForegroundColor Cyan
Write-Host "This will run the SQL script directly on your production database" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run this command:" -ForegroundColor White
Write-Host "psql -h your-host -U your-user -d your-database -f fix-category-table.sql" -ForegroundColor Green
Write-Host ""

# Option 3: Manual database connection
Write-Host "Option 3: Manual database connection" -ForegroundColor Cyan
Write-Host "Connect to your production database and run the SQL from fix-category-table.sql" -ForegroundColor Yellow
Write-Host ""

Write-Host "After applying the fix, verify the table exists by running:" -ForegroundColor White
Write-Host "npx prisma db pull" -ForegroundColor Green
Write-Host ""

Write-Host "Script completed. Choose one of the options above to fix your production database." -ForegroundColor Green
