import type { NextConfig } from "next"

// Configuración de optimización de imágenes
export const imageOptimizationConfig: NextConfig = {
  images: {
    // Formatos soportados
    formats: ['image/webp', 'image/avif'],
    
    // Dominios permitidos para imágenes externas
    domains: [
      'localhost',
      'lb-premium-backend',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    
    // Tamaños de imagen predefinidos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Tamaños de imagen para diferentes breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Configuración de carga
    loader: 'default',
    
    // Configuración de calidad
    quality: 75,
    
    // Configuración de placeholder
    placeholder: 'blur',
    
    // Configuración de blur
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
    
    // Configuración de tiempo de vida del cache
    minimumCacheTTL: 60,
    
    // Configuración de peligro
    dangerous: {
      allowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    
    // Configuración de optimización
    unoptimized: false,
    
    // Configuración de carga diferida
    lazyBoundary: '200px',
  },
  
  // Configuración de compresión
  compress: true,
  
  // Configuración de headers
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Configuración de rewrites para optimización
  async rewrites() {
    return [
      {
        source: '/api/images/:path*',
        destination: '/api/image-optimizer/:path*',
      },
    ]
  },
}

// Configuración de optimización de assets
export const assetOptimizationConfig = {
  // Configuración de fuentes
  fonts: {
    preload: true,
    display: 'swap',
    fallback: 'system-ui, -apple-system, sans-serif',
  },
  
  // Configuración de CSS
  css: {
    minify: true,
    purge: true,
    critical: true,
  },
  
  // Configuración de JavaScript
  javascript: {
    minify: true,
    bundle: true,
    treeshake: true,
  },
  
  // Configuración de imágenes
  images: {
    webp: true,
    avif: true,
    quality: 75,
    progressive: true,
  },
  
  // Configuración de videos
  videos: {
    lazy: true,
    preload: 'metadata',
    quality: 'medium',
  },
  
  // Configuración de iconos
  icons: {
    sprite: true,
    lazy: true,
    format: 'svg',
  },
}

// Configuración de performance
export const performanceConfig = {
  // Configuración de Core Web Vitals
  coreWebVitals: {
    lcp: 2.5, // Largest Contentful Paint
    fid: 100, // First Input Delay
    cls: 0.1, // Cumulative Layout Shift
  },
  
  // Configuración de preload
  preload: {
    critical: true,
    fonts: true,
    images: true,
    scripts: true,
  },
  
  // Configuración de prefetch
  prefetch: {
    links: true,
    images: true,
    scripts: false,
  },
  
  // Configuración de service worker
  serviceWorker: {
    enabled: true,
    cache: true,
    offline: true,
  },
}

// Configuración de bundle analyzer
export const bundleAnalyzerConfig = {
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
  analyzerMode: 'static',
  reportFilename: 'bundle-report.html',
}

// Configuración de webpack
export const webpackConfig = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
}
