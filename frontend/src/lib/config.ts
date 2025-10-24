/**
 * Configuración centralizada de la aplicación
 * Todas las URLs y configuraciones deben venir de aquí
 */

// Configuración de la API
export const API_CONFIG = {
  // URL base de la API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
  
  // URL base del backend (para imágenes y archivos)
  // En Docker, usar el nombre del servicio; en desarrollo local, usar localhost
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? 'http://localhost:3002' 
      : 'http://lb-premium-backend:3001'),
  
  // Entorno actual
  ENV: process.env.NEXT_PUBLIC_ENV || 'development',
  
  // Timeout para requests
  TIMEOUT: 10000,
  
  // Configuración de reintentos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

// Función para detectar si estamos en un entorno de producción con Docker
const isProductionDocker = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Detectar si estamos en producción con Docker
  const isProduction = process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';
  const hasDockerBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.includes('146.190.116.222');
  
  return isProduction && hasDockerBackendUrl;
};

// Función para obtener la URL correcta según el entorno
export const getCorrectApiUrl = (): string => {
  // Si estamos en producción con Docker, usar la URL externa
  if (isProductionDocker()) {
    return process.env.NEXT_PUBLIC_BACKEND_URL + '/api' || 'http://146.190.116.222:3002/api';
  }
  
  // Para otros casos, usar la configuración normal
  return API_CONFIG.BASE_URL;
};

// Configuración de imágenes
export const IMAGE_CONFIG = {
  // URL base para imágenes
  BASE_URL: API_CONFIG.BACKEND_URL,
  
  // Ruta de uploads
  UPLOADS_PATH: '/uploads',
  
  // Tamaños de imagen por defecto
  DEFAULT_SIZES: {
    thumbnail: '150x150',
    medium: '400x400',
    large: '800x800',
  },
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  // Nombre de la aplicación
  NAME: 'LB Premium',
  
  // Versión
  VERSION: '1.0.0',
  
  // Entorno
  ENV: API_CONFIG.ENV,
  
  // Es desarrollo
  IS_DEV: API_CONFIG.ENV === 'development',
  
  // Es producción
  IS_PROD: API_CONFIG.ENV === 'production',
} as const;

// Funciones de utilidad
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Si empieza con /, usar la URL base del backend
  if (imagePath.startsWith('/')) {
    return `${IMAGE_CONFIG.BASE_URL}${imagePath}`;
  }
  
  // Si no, asumir que es un path relativo y agregar /uploads/
  return `${IMAGE_CONFIG.BASE_URL}${IMAGE_CONFIG.UPLOADS_PATH}/${imagePath}`;
};

export const getApiUrl = (endpoint: string = ''): string => {
  const baseUrl = getCorrectApiUrl();
  
  if (!endpoint) return baseUrl;
  
  // Si el endpoint ya empieza con /, no agregar otro /
  if (endpoint.startsWith('/')) {
    return `${baseUrl}${endpoint}`;
  }
  
  return `${baseUrl}/${endpoint}`;
};

// Validación de configuración
export const validateConfig = (): void => {
  if (!API_CONFIG.BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL no está configurada');
  }
  
  if (!API_CONFIG.BACKEND_URL) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL no está configurada');
  }
  
  console.log('✅ Configuración validada correctamente');
  console.log('🔗 API URL:', API_CONFIG.BASE_URL);
  console.log('🔗 Backend URL:', API_CONFIG.BACKEND_URL);
  console.log('🌍 Entorno:', API_CONFIG.ENV);
};

// Exportar todo por defecto
export default {
  API_CONFIG,
  IMAGE_CONFIG,
  APP_CONFIG,
  getImageUrl,
  getApiUrl,
  validateConfig,
};
