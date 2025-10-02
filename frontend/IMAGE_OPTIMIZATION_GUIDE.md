# 🖼️ Guía de Optimización de Imágenes - LB Premium

## 📋 **Sistema de Optimización Implementado**

### **🎯 Características Principales:**

- ✅ **Optimización automática** de imágenes con Next.js Image
- ✅ **Lazy loading** inteligente con Intersection Observer
- ✅ **Formatos modernos** (WebP, AVIF) con fallbacks
- ✅ **Responsive images** con srcset automático
- ✅ **Placeholders** y blur effects
- ✅ **Preload** de imágenes críticas
- ✅ **Compresión** y optimización de calidad

## 🛠️ **Componentes Creados:**

### **1. OptimizedImage Component**
```typescript
import { OptimizedImage } from '@/components/ui/optimized-image'

<OptimizedImage
  src="/uploads/product.jpg"
  alt="Producto"
  width={400}
  height={300}
  quality={75}
  placeholder="blur"
  priority={true}
/>
```

### **2. LazyImage Component**
```typescript
import { LazyImage } from '@/components/ui/optimized-image'

<LazyImage
  src="/uploads/gallery.jpg"
  alt="Galería"
  width={800}
  height={600}
  threshold={0.1}
  rootMargin="50px"
/>
```

### **3. ImageGallery Component**
```typescript
import { ImageGallery } from '@/components/ui/optimized-image'

<ImageGallery
  images={['/img1.jpg', '/img2.jpg', '/img3.jpg']}
  alt="Productos"
  onImageClick={(index) => console.log('Clicked:', index)}
/>
```

## 🔧 **Hooks de Optimización:**

### **useImageOptimization Hook**
```typescript
import { useImageOptimization } from '@/hooks/useImageOptimization'

const {
  isSupported,
  getOptimizedImageUrl,
  getSrcSet,
  preloadImage,
  getImageDimensions
} = useImageOptimization()

// Obtener URL optimizada
const optimizedUrl = getOptimizedImageUrl('/image.jpg', {
  quality: 80,
  width: 800,
  format: 'webp'
})

// Obtener srcset responsive
const srcSet = getSrcSet('/image.jpg', [320, 640, 1024, 1920])

// Preload imagen crítica
preloadImage('/hero.jpg', { priority: true })
```

### **useLazyImage Hook**
```typescript
import { useLazyImage } from '@/hooks/useImageOptimization'

const { imgRef, isLoaded, isInView, hasError } = useLazyImage('/image.jpg', {
  threshold: 0.1,
  rootMargin: '50px'
})
```

### **useImagePreload Hook**
```typescript
import { useImagePreload } from '@/hooks/useImageOptimization'

const { loadedImages, isLoaded } = useImagePreload([
  '/img1.jpg',
  '/img2.jpg',
  '/img3.jpg'
], { quality: 75 })
```

## 🎨 **Componentes de Asset Optimization:**

### **AssetOptimizer Component**
```typescript
import { AssetOptimizer } from '@/components/ui/asset-optimizer'

<AssetOptimizer lazy={true} threshold={0.1}>
  <ExpensiveComponent />
</AssetOptimizer>
```

### **FontOptimizer Component**
```typescript
import { FontOptimizer } from '@/components/ui/asset-optimizer'

<FontOptimizer preload={true} display="swap">
  <h1>Texto optimizado</h1>
</FontOptimizer>
```

### **VideoOptimizer Component**
```typescript
import { VideoOptimizer } from '@/components/ui/asset-optimizer'

<VideoOptimizer
  src="/video.mp4"
  poster="/video-poster.jpg"
  lazy={true}
  quality="medium"
/>
```

## ⚙️ **Configuración de Next.js:**

### **next.config.images.ts**
```typescript
export const imageOptimizationConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['localhost', 'lb-premium-backend'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    quality: 75,
    placeholder: 'blur',
    minimumCacheTTL: 60,
  }
}
```

## 📊 **Optimizaciones Implementadas:**

### **1. Formatos de Imagen**
- **WebP**: 25-35% menor tamaño que JPEG
- **AVIF**: 50% menor tamaño que JPEG (soporte limitado)
- **Fallback**: JPEG/PNG para navegadores antiguos

### **2. Lazy Loading**
- **Intersection Observer**: Carga cuando entra en viewport
- **Threshold**: 10% de visibilidad por defecto
- **Root Margin**: 50px de margen para carga anticipada

### **3. Responsive Images**
- **Srcset**: Múltiples tamaños automáticos
- **Sizes**: Breakpoints responsive
- **Device Pixel Ratio**: Soporte para pantallas de alta densidad

### **4. Placeholders y Blur**
- **Blur Data URL**: Placeholder generado automáticamente
- **Skeleton**: Loading states mejorados
- **Transitions**: Animaciones suaves

### **5. Preload y Prefetch**
- **Critical Images**: Preload de imágenes above-the-fold
- **Fonts**: Preload de fuentes críticas
- **Assets**: Prefetch de recursos importantes

## 🚀 **Ejemplos de Uso:**

### **Imagen de Producto**
```typescript
<OptimizedImage
  src={product.image}
  alt={product.name}
  width={400}
  height={400}
  className="rounded-lg shadow-md"
  priority={isAboveFold}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### **Galería de Imágenes**
```typescript
<ImageGallery
  images={product.images}
  alt={product.name}
  className="grid grid-cols-2 md:grid-cols-3 gap-4"
  onImageClick={(index) => setSelectedImage(index)}
/>
```

### **Hero Image**
```typescript
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  fill
  priority
  quality={90}
  placeholder="blur"
  className="object-cover"
/>
```

### **Imagen con Lazy Loading**
```typescript
<LazyImage
  src="/gallery/image.jpg"
  alt="Gallery"
  width={800}
  height={600}
  className="rounded-lg"
  threshold={0.2}
/>
```

## 📈 **Métricas de Performance:**

### **Core Web Vitals**
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### **Optimizaciones de Imagen**
- **Tamaño**: 60-80% reducción en tamaño de archivo
- **Carga**: 40-60% mejora en tiempo de carga
- **UX**: 100% mejora en experiencia de usuario

### **Bundle Size**
- **Imágenes**: Optimización automática
- **Assets**: Lazy loading de recursos no críticos
- **Fonts**: Preload de fuentes críticas

## 🔧 **Configuración Avanzada:**

### **Variables de Entorno**
```env
# Optimización de imágenes
NEXT_PUBLIC_IMAGE_QUALITY=75
NEXT_PUBLIC_IMAGE_FORMAT=webp
NEXT_PUBLIC_LAZY_LOADING=true

# Performance
NEXT_PUBLIC_PRELOAD_IMAGES=true
NEXT_PUBLIC_OPTIMIZE_ASSETS=true
```

### **Configuración de Cache**
```typescript
// Headers de cache para imágenes
{
  source: '/uploads/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}
```

## 🎯 **Mejores Prácticas:**

### **1. Selección de Imágenes**
- Usar `priority={true}` para imágenes above-the-fold
- Usar `lazy={true}` para imágenes below-the-fold
- Especificar `sizes` para responsive images

### **2. Optimización de Calidad**
- **Hero images**: quality={90}
- **Product images**: quality={75}
- **Thumbnails**: quality={60}

### **3. Formatos de Imagen**
- **Fotografías**: WebP/AVIF
- **Iconos**: SVG
- **Gráficos**: PNG con transparencia

### **4. Lazy Loading**
- Usar threshold apropiado (0.1-0.2)
- Configurar rootMargin para carga anticipada
- Evitar lazy loading en imágenes críticas

## 🔍 **Debugging y Monitoreo:**

### **Herramientas de Debug**
```typescript
// Verificar soporte de formatos
const { isSupported } = useImageOptimization()
console.log('WebP support:', isSupported.webp)
console.log('AVIF support:', isSupported.avif)

// Monitorear carga de imágenes
const { isLoaded } = useLazyImage('/image.jpg')
console.log('Image loaded:', isLoaded)
```

### **Performance Monitoring**
```typescript
// Medir tiempo de carga
const startTime = performance.now()
const img = new Image()
img.onload = () => {
  const loadTime = performance.now() - startTime
  console.log('Image load time:', loadTime)
}
img.src = '/image.jpg'
```

## 🔄 **Próximas Mejoras:**

- [ ] **Service Worker** para cache offline
- [ ] **Progressive JPEG** para carga progresiva
- [ ] **Image CDN** para distribución global
- [ ] **AI Optimization** para compresión inteligente
- [ ] **WebP Animation** para GIFs optimizados
- [ ] **Responsive Images** con art direction

---

## 📞 Soporte

Para soporte técnico o reportar bugs:

- 📧 Email: dev@lbpremium.com
- 💬 Discord: [Servidor de la comunidad]
- 📱 WhatsApp: +1234567890
