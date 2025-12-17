# 🖼️ Guía de Conversión Automática a WebP

Esta guía explica cómo optimizar todas las imágenes del sistema convirtiéndolas automáticamente a formato WebP.

## 📋 ¿Qué hace esta solución?

1. **Conversión automática de nuevas imágenes**: Todas las imágenes que se suban desde ahora se convertirán automáticamente a WebP
2. **Conversión de imágenes existentes**: Script para convertir todas las imágenes PNG, JPG, etc. que ya están en el servidor
3. **Actualización de referencias en BD**: Script para actualizar todas las referencias en la base de datos

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

Esto instalará `sharp`, la librería que se usa para la conversión de imágenes.

## 📝 Uso

### Conversión de imágenes existentes

Para convertir todas las imágenes PNG, JPG, etc. que ya están en el servidor:

```bash
cd backend
npm run convert-images
```

Este script:
- ✅ Busca todas las imágenes en `./uploads`
- ✅ Convierte PNG, JPG, JPEG, GIF a WebP
- ✅ Elimina los archivos originales después de la conversión
- ✅ Genera un reporte con el espacio ahorrado

**Ejemplo de salida:**
```
🖼️  Iniciando conversión de imágenes a WebP...

📁 Directorio: /path/to/uploads

📊 Encontradas 25 imagen(es) para convertir.

[1/25] Convirtiendo: producto-123.png...
   ✅ Convertido: producto-123.webp (2.5 MB → 1.8 MB, -28.00%)
[2/25] Convirtiendo: slide-456.jpg...
   ✅ Convertido: slide-456.webp (1.2 MB → 0.9 MB, -25.00%)
...

📊 REPORTE DE CONVERSIÓN
============================================================
✅ Conversiones exitosas: 25
   Tamaño original total: 45.2 MB
   Tamaño convertido total: 32.1 MB
   Reducción total: 29.02%
   Espacio ahorrado: 13.1 MB
```

### Actualización de referencias en la base de datos

**IMPORTANTE**: Ejecuta esto DESPUÉS de convertir las imágenes físicas.

```bash
cd backend
npm run update-image-refs
```

Este script actualiza todas las referencias en la base de datos:
- `Product.image` y `Product.images[]`
- `Slide.image` y `Slide.mobileImage`
- `About.images[]`
- `Brand.logo`
- `Category.image`
- `CartItem.image`

**Ejemplo de salida:**
```
🔄 Iniciando actualización de referencias de imágenes en la base de datos...

📦 Actualizando productos...
   ✅ Productos actualizados: 15
🎬 Actualizando slides...
   ✅ Slides actualizados: 8
📄 Actualizando about...
   ✅ About actualizados: 1
🏷️  Actualizando marcas...
   ✅ Marcas actualizadas: 12
📂 Actualizando categorías...
   ✅ Categorías actualizadas: 10
🛒 Actualizando items del carrito...
   ✅ Cart items actualizados: 0

📊 REPORTE DE ACTUALIZACIÓN
============================================================
✅ Total de registros actualizados: 46
❌ Total de errores: 0

   Product (image, images): 15 actualizados
   Slide (image, mobileImage): 8 actualizados
   About (images): 1 actualizados
   Brand (logo): 12 actualizados
   Category (image): 10 actualizados
   CartItem (image): 0 actualizados
```

## ⚙️ Conversión Automática de Nuevas Imágenes

Desde ahora, **todas las imágenes nuevas que se suban se convertirán automáticamente a WebP**. No necesitas hacer nada especial, simplemente sube las imágenes como siempre.

El sistema:
- ✅ Detecta automáticamente si es una imagen
- ✅ La convierte a WebP con calidad 85% (balance entre calidad y tamaño)
- ✅ Elimina el archivo original
- ✅ Retorna la URL del archivo WebP

## 🔧 Configuración Avanzada

### Ajustar calidad de compresión

Si quieres ajustar la calidad de compresión (por defecto es 85%), edita:

`backend/src/upload/upload.controller.ts`

```typescript
const webpPath = await this.imageConversionService.convertToWebP(filePath, 85);
//                                                                        ^^
//                                                                    Cambia aquí
```

- **85-100**: Alta calidad, archivos más grandes
- **70-85**: Balance recomendado
- **50-70**: Archivos más pequeños, calidad aceptable

### Ajustar esfuerzo de compresión

En `backend/src/upload/image-conversion.service.ts`:

```typescript
.webp({ quality, effort: 6 }) // effort: 0-6
//                    ^^
//            Mayor = mejor compresión pero más lento
```

## 📊 Beneficios

- **Reducción de tamaño**: Típicamente 25-35% más pequeño que PNG/JPG
- **Mejor rendimiento**: Páginas cargan más rápido
- **Menor uso de ancho de banda**: Especialmente importante en móviles
- **Mejor SEO**: Google favorece sitios más rápidos

## ⚠️ Notas Importantes

1. **Backup recomendado**: Antes de ejecutar los scripts, haz un backup de:
   - El directorio `./uploads`
   - La base de datos

2. **Orden de ejecución**:
   ```
   1. npm run convert-images      (convierte imágenes físicas)
   2. npm run update-image-refs    (actualiza referencias en BD)
   ```

3. **Videos**: Los videos NO se convierten, solo las imágenes

4. **Imágenes ya en WebP**: Si una imagen ya es WebP, no se procesa

## 🐛 Solución de Problemas

### Error: "sharp no se encuentra"
```bash
cd backend
npm install sharp
```

### Error: "No se puede leer el directorio uploads"
Verifica que el directorio `./uploads` existe y tiene permisos de lectura/escritura.

### Error de conexión a la base de datos
Verifica que el archivo `.env` tiene la configuración correcta de `DATABASE_URL`.

### Las imágenes no se muestran después de la conversión
1. Verifica que ejecutaste `npm run update-image-refs`
2. Verifica que los archivos WebP existen en `./uploads`
3. Limpia la caché del navegador

## 📚 Archivos Creados

- `backend/src/upload/image-conversion.service.ts` - Servicio de conversión
- `backend/src/upload/upload.controller.ts` - Controlador actualizado
- `backend/src/upload/upload.module.ts` - Módulo actualizado
- `backend/scripts/convert-images-to-webp.ts` - Script de conversión
- `backend/scripts/update-db-image-references.ts` - Script de actualización BD

## ✅ Checklist de Implementación

- [ ] Instalar dependencias: `npm install`
- [ ] Hacer backup de `./uploads` y base de datos
- [ ] Ejecutar `npm run convert-images`
- [ ] Verificar que las imágenes se convirtieron correctamente
- [ ] Ejecutar `npm run update-image-refs`
- [ ] Verificar que las referencias en BD se actualizaron
- [ ] Probar subir una nueva imagen (debe convertirse automáticamente)
- [ ] Verificar que las imágenes se muestran correctamente en el frontend

---

✨ **¡Listo!** Ahora todas tus imágenes están optimizadas y las nuevas se optimizarán automáticamente.

