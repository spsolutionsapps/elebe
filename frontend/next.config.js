/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  skipTrailingSlashRedirect: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  
  // Optimización de imágenes
  images: {
    // Dominios permitidos para imágenes externas
    domains: [
      'localhost',
      '127.0.0.1',
      'lbpremium.com',
      'www.lbpremium.com',
      'static.landkit.engeni.com', // Para imágenes de servicios
      'logos-world.net', // Para logos de marcas
    ],
    
    // Formatos de imagen modernos (WebP, AVIF)
    formats: ['image/webp', 'image/avif'],
    
    // Configuración de lazy loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Calidad de compresión se maneja en el componente Image
    
    // Configuración de carga
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Configuración de loader personalizado para desarrollo
    loader: 'default',
    
    // Configuración de remotePatterns para mayor seguridad
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.landkit.engeni.com',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'logos-world.net',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
  },
  
  // Headers de seguridad y optimización
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
