# 🏷️ Migración de Categorías de Productos

## 📋 Resumen de Cambios

Se han actualizado las categorías de productos del sitio web con las nuevas categorías definidas:

### 🆕 Nuevas Categorías

1. **Oficina** - welcome kits, cuadernos, biromes, soportes, etc
2. **Deporte** - remeras maratones, mochilas, toallas, bolsos, brazaletes, etc
3. **Viajes** - carry on, mochilas, bolsos, neceser, antifaces, almohadas, etc
4. **Moda** - hoodies, Crew, remeras, chombas, gorras chetas, camperas, etc
5. **Uniformes** - trabajo, lady stork, Michelin, etc
6. **Bebidas** - botellas, vasos, termos, mates, tazas
7. **Imprenta** - pack, poster, tarjetones, stickers, etc
8. **Merch** - pins, lanyards, gorras, totebags, llaveros, etc
9. **Tecnología** - Auriculares, relojes, cargadores, insta pix, etc
10. **Bonus** - 3d, cosas especiales, abanicos, etc

## 🔧 Archivos Modificados

### Frontend

1. **`frontend/src/components/CatalogMegaMenu.tsx`**
   - Actualizado el menú de categorías con las nuevas categorías
   - Reducido de 5 columnas a 2 columnas para mejor organización
   - Actualizados los títulos de las secciones

2. **`frontend/src/app/(public)/catalogo/page.tsx`**
   - Actualizado el mapeo de parámetros de URL a categorías reales
   - Las nuevas categorías ahora funcionan correctamente con el filtrado

3. **`frontend/src/components/Navigation.tsx`**
   - Actualizadas las referencias en el menú móvil
   - Cambiadas las categorías de ejemplo (Ropa, Accesorios, Calzado) por (Oficina, Moda, Deporte)

4. **`frontend/src/app/admin/products/page.tsx`**
   - Actualizado el select de categorías en el formulario de productos
   - Cambiado el valor por defecto de "General" a "Oficina"
   - Actualizadas todas las opciones del select

5. **`frontend/src/components/AddToCartButton.tsx`**
   - Actualizado el valor por defecto de categoría de "General" a "Oficina"

### Backend

6. **`backend/scripts/migrate-categories.js`** (NUEVO)
   - Script de migración para actualizar productos existentes
   - Mapeo inteligente de categorías antiguas a nuevas
   - Estadísticas de migración y resumen de cambios

## 🚀 Cómo Ejecutar la Migración

### 1. Ejecutar el Script de Migración

```bash
# Desde el directorio del proyecto
cd backend
node scripts/migrate-categories.js
```

Este script:
- Consulta todos los productos existentes
- Mapea las categorías antiguas a las nuevas según la lógica definida
- Actualiza la base de datos
- Muestra estadísticas del proceso

### 2. Verificar los Cambios

```bash
# Verificar productos después de la migración
node scripts/check-products-docker.js
```

## 📊 Mapeo de Categorías

### Categorías que se Mapean Directamente
- `Tecnología` → `Tecnología`
- `Deporte` → `Deporte`
- `Viajes` → `Viajes`

### Categorías que se Consolidan
- `General`, `Hogar`, `Escritorio`, `Escritura` → `Oficina`
- `Ropa`, `Apparel`, `Apparel - Abrigo`, `Apparel - Chombas`, `Apparel - Remeras`, `Calzado`, `Gorros` → `Moda`
- `Bolsos`, `Bolsas y Tote Bags`, `Bolsos y Mochilas`, `Paraguas` → `Viajes`
- `Cocina`, `Drinkware`, `Mates, termos y materas`, `Coolers y luncheras` → `Bebidas`
- `Accesorios`, `Joyas`, `Perfumes`, `Cosméticos`, `Llaveros` → `Merch`
- `Logo 24hs`, `Packaging` → `Imprenta`
- `Primavera`, `Próximos Arribos`, `Sustentables`, `2025 Día de la madre`, `2025 Felices Fiestas`, `2025 Novedades`, `2025 Reingresos` → `Bonus`
- `Ferias del Agro y Rural`, `Minería` → `Uniformes`

### Productos sin Categoría
- Los productos que no tienen categoría o tienen categoría vacía se asignan a `Oficina` por defecto

## ✅ Verificación Post-Migración

1. **Verificar el menú de catálogo**: Las nuevas categorías deben aparecer correctamente
2. **Probar filtros**: Cada categoría debe filtrar productos correctamente
3. **Verificar admin**: El formulario de productos debe mostrar las nuevas categorías
4. **Verificar productos existentes**: Los productos deben tener las nuevas categorías asignadas

## 🔄 Rollback (Si es Necesario)

Si necesitas revertir los cambios:

1. **Base de datos**: Restaurar desde backup
2. **Código**: Revertir los commits de los archivos modificados
3. **Opcional**: Ejecutar el script original `update-products-category.js` para volver a "General"

## 📝 Notas Importantes

- La migración es **idempotente**: se puede ejecutar múltiples veces sin problemas
- Los productos que ya tienen una de las nuevas categorías no se modifican
- El script muestra estadísticas detalladas del proceso
- Se mantiene la compatibilidad con la estructura existente de la base de datos

## 🎯 Próximos Pasos

1. Ejecutar la migración en el entorno de desarrollo
2. Probar todas las funcionalidades
3. Ejecutar en producción cuando esté verificado
4. Actualizar documentación de productos si es necesario
