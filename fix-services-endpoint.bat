@echo off
echo 🔧 Solucionando problema del endpoint de servicios...

echo 📋 1. Deteniendo todos los procesos de Node.js...
taskkill /f /im node.exe 2>nul

echo ⏳ 2. Esperando 3 segundos...
timeout /t 3 /nobreak > nul

echo 🔄 3. Limpiando cache de Node.js...
cd backend
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist

echo 📦 4. Reinstalando dependencias...
npm install

echo 🏗️ 5. Recompilando...
npm run build

echo 🗄️ 6. Regenerando Prisma...
npm run db:generate

echo 🚀 7. Iniciando servidor...
npm run start:dev

pause
