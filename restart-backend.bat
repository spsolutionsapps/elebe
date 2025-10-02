@echo off
echo 🔄 Reiniciando backend...

echo 📋 Deteniendo procesos en puerto 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    taskkill /PID %%a /F
)

echo ⏳ Esperando 3 segundos...
timeout /t 3 /nobreak > nul

echo 🚀 Iniciando backend...
cd backend
npm run start:dev

pause
