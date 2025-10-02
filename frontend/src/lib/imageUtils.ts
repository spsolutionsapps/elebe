/**
 * Utilidades para manejo de URLs de imágenes
 * @deprecated Usar las funciones de src/lib/config.ts en su lugar
 */

import { getImageUrl as getImageUrlFromConfig, getApiUrl as getApiUrlFromConfig, API_CONFIG } from './config';

/**
 * Obtiene la URL base del backend para imágenes
 * @deprecated Usar API_CONFIG.BACKEND_URL en su lugar
 */
export function getBackendImageUrl(): string {
  return API_CONFIG.BACKEND_URL;
}

/**
 * Construye la URL completa para una imagen
 * @param imagePath - Ruta de la imagen (ej: "image-123.jpg" o "/uploads/image-123.jpg")
 * @returns URL completa de la imagen
 * @deprecated Usar getImageUrlFromConfig de src/lib/config.ts en su lugar
 */
export function getImageUrl(imagePath: string): string {
  return getImageUrlFromConfig(imagePath);
}

/**
 * Obtiene la URL del backend para la API
 * @deprecated Usar getApiUrlFromConfig de src/lib/config.ts en su lugar
 */
export function getApiUrl(): string {
  return getApiUrlFromConfig();
}
