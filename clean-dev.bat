@echo off
echo Cleaning development environment...
echo.

echo Stopping containers...
docker-compose -f docker-compose.dev.yml down -v

echo.
echo Removing containers and images...
docker-compose -f docker-compose.dev.yml rm -f

echo.
echo Cleaning Docker system...
docker system prune -f

echo.
echo Development environment cleaned!
echo You can now run: start-dev-with-env.bat
echo.
pause
