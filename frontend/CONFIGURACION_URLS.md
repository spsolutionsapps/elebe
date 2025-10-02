# 🔧 Configuración de URLs - LB Premium

## 📋 Resumen

Se ha centralizado toda la configuración de URLs en un archivo único para facilitar el mantenimiento y evitar URLs hardcodeadas.

## 🗂️ Archivos Modificados

### **Nuevo archivo de configuración:**
- `src/lib/config.ts` - Configuración centralizada

### **Archivos actualizados:**
- `src/lib/imageUtils.ts` - Ahora usa la configuración centralizada
- `src/lib/api.ts` - Usa API_CONFIG.BASE_URL
- `src/lib/api-client.ts` - Usa API_CONFIG.BASE_URL y TIMEOUT
- `src/app/(public)/page.tsx` - Usa getImageUrl centralizada
- `src/app/(public)/nosotros/page.tsx` - Usa API_CONFIG.BASE_URL
- `src/app/(public)/servicios/page.tsx` - Usa API_CONFIG.BASE_URL
- `src/app/admin/brands/page.tsx` - Usa API_CONFIG.BASE_URL
- `src/app/admin/products/page.tsx` - Usa getImageUrl centralizada
- `src/app/admin/slides/page.tsx` - Usa getImageUrl centralizada
- `src/components/ImageGallery.tsx` - Usa getImageUrl centralizada
- `src/components/SlidesGallery.tsx` - Usa getImageUrl centralizada

## 🌍 Variables de Entorno

### **Desarrollo Local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_ENV=development
```

### **Docker:**
```bash
NEXT_PUBLIC_API_URL=http://lb-premium-backend:3001/api
NEXT_PUBLIC_BACKEND_URL=http://lb-premium-backend:3001
NEXT_PUBLIC_ENV=production
```

### **Producción:**
```bash
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
NEXT_PUBLIC_BACKEND_URL=https://tu-dominio.com
NEXT_PUBLIC_ENV=production
```

## 🚀 Uso

### **Importar configuración:**
```typescript
import { API_CONFIG, IMAGE_CONFIG, APP_CONFIG, getImageUrl, getApiUrl } from '@/lib/config';
```

### **Obtener URL de imagen:**
```typescript
const imageUrl = getImageUrl('/uploads/image.jpg');
// Resultado: http://localhost:3001/uploads/image.jpg
```

### **Obtener URL de API:**
```typescript
const apiUrl = getApiUrl('/products');
// Resultado: http://localhost:3001/api/products
```

### **Acceder a configuración:**
```typescript
console.log(API_CONFIG.BASE_URL);     // http://localhost:3001/api
console.log(API_CONFIG.BACKEND_URL);  // http://localhost:3001
console.log(APP_CONFIG.IS_DEV);       // true en desarrollo
```

## ✅ Beneficios

1. **🔧 Mantenimiento fácil** - Un solo lugar para cambiar URLs
2. **🌍 Multi-entorno** - Fácil configuración para diferentes entornos
3. **🚫 Sin URLs hardcodeadas** - Todo viene de variables de entorno
4. **📱 Escalable** - Fácil agregar nuevas configuraciones
5. **🔍 Validación** - Función validateConfig() para verificar configuración

## 🛠️ Migración Completada

- ✅ **20 archivos** actualizados
- ✅ **0 URLs hardcodeadas** restantes
- ✅ **Configuración centralizada** implementada
- ✅ **Variables de entorno** configuradas
- ✅ **Documentación** creada

## 📝 Notas Importantes

1. **Variables de entorno** deben empezar con `NEXT_PUBLIC_` para ser accesibles en el cliente
2. **Archivo .env.local** debe crearse localmente (no está en git)
3. **Archivo env.example** muestra la configuración de ejemplo
4. **Funciones deprecated** en imageUtils.ts mantienen compatibilidad hacia atrás

## 🔄 Próximos Pasos

1. Crear archivo `.env.local` con las variables de entorno
2. Probar en diferentes entornos (desarrollo, Docker, producción)
3. Actualizar documentación de despliegue
4. Considerar agregar más configuraciones según necesidades
