# Guía de Fuentes Gotham - LB Premium

## Configuración Implementada

Se han configurado las fuentes Gotham para el sitio público con las siguientes variantes:

### Variantes de Gotham Disponibles

1. **Gotham Book** (font-weight: 400)
   - Uso: Texto del body, párrafos, contenido general
   - Clase CSS: `.font-body` o automático en elementos `<p>`, `<span>`, etc.

2. **Gotham Medium** (font-weight: 500)
   - Uso: Encabezados, títulos, elementos destacados
   - Clase CSS: `.font-heading` o automático en elementos `<h1>` a `<h6>`

3. **Gotham Black Italic** (font-weight: 900, font-style: italic)
   - Uso: Énfasis especial, llamadas de atención
   - Clase CSS: `.font-black-italic`

## Archivos de Fuente Necesarios

Debes colocar los siguientes archivos en `frontend/public/fonts/`:

```
frontend/public/fonts/
├── GothamBook.woff2          (requerido)
├── GothamBook.woff           (fallback)
├── GothamMedium.woff2        (requerido)
├── GothamMedium.woff         (fallback)
├── GothamBlackItalic.woff2   (requerido)
└── GothamBlackItalic.woff    (fallback)
```

**Nota**: Los archivos .woff2 son los principales y modernos. Los .woff son para compatibilidad con navegadores antiguos.

## Ejemplos de Uso

### Uso Automático (Recomendado)

La mayoría de elementos usarán Gotham automáticamente:

```tsx
// Encabezados - Gotham Medium automático
<h1>Título Principal</h1>
<h2>Subtítulo</h2>

// Texto del body - Gotham Book automático
<p>Este es un párrafo con Gotham Book</p>
<span>Texto normal</span>
```

### Uso con Clases CSS

```tsx
// Forzar Gotham Book
<div className="font-body">
  Contenido con Gotham Book
</div>

// Forzar Gotham Medium
<div className="font-heading">
  Texto destacado con Gotham Medium
</div>

// Gotham Black Italic para énfasis especial
<span className="font-black-italic">
  ¡Texto muy destacado!
</span>
```

### Combinaciones con Tailwind

```tsx
// Gotham Book con tamaño personalizado
<p className="font-body text-lg">
  Párrafo grande con Gotham Book
</p>

// Gotham Medium con color personalizado
<h2 className="font-heading text-blue-600">
  Título azul con Gotham Medium
</h2>

// Gotham Black Italic con efectos
<span className="font-black-italic text-2xl text-red-600">
  Llamada de atención
</span>
```

## Dónde NO se Aplican las Fuentes

Las fuentes Gotham están configuradas para el **sitio público únicamente**. El panel de administración puede usar fuentes diferentes si es necesario.

## Verificación de Carga

Para verificar que las fuentes se carguen correctamente:

1. Abre el sitio en el navegador
2. Abre las DevTools (F12)
3. Ve a la pestaña "Network" (Red)
4. Filtra por "Font"
5. Recarga la página
6. Deberías ver las fuentes Gotham cargándose desde `/fonts/`

## Solución de Problemas

### Las fuentes no se ven

1. **Verifica que los archivos existen**:
   ```bash
   ls frontend/public/fonts/
   ```

2. **Verifica que los nombres coinciden exactamente**:
   - `GothamBook.woff2`
   - `GothamMedium.woff2`
   - `GothamBlackItalic.woff2`

3. **Limpia la caché de Next.js**:
   ```bash
   cd frontend
   rm -rf .next
   npm run dev
   ```

### Las fuentes se ven borrosas o incorrectas

1. Verifica que los archivos .woff2 sean válidos
2. Asegúrate de que las fuentes sean las versiones correctas:
   - Gotham Book (no Bold, no Light)
   - Gotham Medium (no Regular, no Semibold)
   - Gotham Black Italic (no Black regular, no Heavy Italic)

## Cómo Obtener las Fuentes

Gotham es una fuente comercial que debe comprarse legalmente:

1. **Sitio oficial**: https://www.typography.com/fonts/gotham/
2. **Licencia**: Asegúrate de tener licencia web válida
3. **Conversión**: Si tienes .ttf/.otf, convierte a .woff2 en:
   - https://transfonter.org/ (recomendado)
   - https://cloudconvert.com/woff2-converter

### Configuración Recomendada en Transfonter

Al convertir las fuentes:
- ✅ WOFF2
- ✅ WOFF (opcional, para compatibilidad)
- ✅ Add local() rule
- ✅ Remove Glyphs: None
- Font display: swap

## Rendimiento

Las fuentes están optimizadas para carga rápida:

- **font-display: swap** - Muestra texto inmediatamente con fuente del sistema mientras Gotham carga
- **Formato WOFF2** - Compresión superior (30-50% más pequeño que TTF)
- **Carga local** - No depende de servicios externos como Google Fonts

## Archivos Modificados

Los siguientes archivos fueron modificados para implementar Gotham:

1. `frontend/src/app/globals.css` - Definiciones @font-face y estilos
2. `frontend/src/components/FontProvider.tsx` - Provider simplificado
3. `frontend/public/fonts/README.md` - Instrucciones de archivos necesarios

## Soporte y Compatibilidad

- ✅ Chrome/Edge (todos)
- ✅ Firefox (todos)
- ✅ Safari 12+
- ✅ iOS Safari 10+
- ✅ Android WebView
- ⚠️ IE 11 (requiere .woff como fallback)



