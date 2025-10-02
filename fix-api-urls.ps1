# Script para corregir todas las URLs de API en el frontend
# Cambia process.env.NEXT_PUBLIC_API_URL por http://localhost:3001/api

Write-Host "Corrigiendo URLs de API en el frontend..." -ForegroundColor Yellow

# Lista de archivos a corregir
$files = @(
    "frontend/src/app/(public)/servicios/page.tsx",
    "frontend/src/app/(public)/contacto/page.tsx", 
    "frontend/src/app/(public)/catalogo/page.tsx",
    "frontend/src/app/admin/services/page.tsx",
    "frontend/src/app/admin/products/page.tsx",
    "frontend/src/app/admin/slides/page.tsx",
    "frontend/src/app/admin/clients/page.tsx",
    "frontend/src/app/admin/about/page.tsx",
    "frontend/src/app/admin/tasks/page.tsx",
    "frontend/src/app/admin/reminders/page.tsx",
    "frontend/src/app/admin/inquiries/page.tsx",
    "frontend/src/hooks/useInquiriesCount.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Corrigiendo: $file" -ForegroundColor Cyan
        
        # Leer el contenido del archivo
        $content = Get-Content $file -Raw
        
        # Reemplazar las URLs problemáticas
        $content = $content -replace 'process\.env\.NEXT_PUBLIC_API_URL \|\| ''http://backend:3001/api''', 'http://localhost:3001/api'
        $content = $content -replace 'process\.env\.NEXT_PUBLIC_API_URL', 'http://localhost:3001/api'
        
        # Escribir el contenido corregido
        Set-Content $file -Value $content -NoNewline
        
        Write-Host "  ✅ Corregido" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Archivo no encontrado: $file" -ForegroundColor Red
    }
}

Write-Host "`n¡Corrección completada!" -ForegroundColor Green
Write-Host "Todas las URLs de API ahora apuntan a http://localhost:3001/api" -ForegroundColor White
