@echo off
echo Configurando variables de entorno para Docker...
set NEXT_PUBLIC_API_URL=http://backend:3001/api
set NEXT_PUBLIC_BACKEND_URL=http://backend:3001
set NEXT_PUBLIC_ENV=development

echo Variables configuradas:
echo   NEXT_PUBLIC_API_URL: %NEXT_PUBLIC_API_URL%
echo   NEXT_PUBLIC_BACKEND_URL: %NEXT_PUBLIC_BACKEND_URL%
echo   NEXT_PUBLIC_ENV: %NEXT_PUBLIC_ENV%

echo Levantando contenedores Docker...
docker-compose -f docker-compose.dev.yml up -d

echo Esperando que los contenedores esten listos...
timeout /t 15 /nobreak > nul

echo Verificando estado de los contenedores...
docker-compose -f docker-compose.dev.yml ps

echo.
echo Docker levantado correctamente!
echo Frontend disponible en: http://localhost:3000
echo Backend disponible en: http://localhost:3001
echo Prisma Studio disponible en: http://localhost:5555
echo.
echo Para detener los contenedores, ejecuta:
echo   docker-compose -f docker-compose.dev.yml down