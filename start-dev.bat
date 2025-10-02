@echo off
echo Starting LB Premium in Development Mode...
echo.

echo Starting services with hot reload...
docker-compose -f docker-compose.dev.yml up --build

echo.
echo Development environment is ready!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo Database: localhost:5432
echo.
pause
