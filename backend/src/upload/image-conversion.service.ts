import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageConversionService {
  private readonly logger = new Logger(ImageConversionService.name);

  /**
   * Convierte una imagen a WebP automáticamente
   * @param filePath Ruta completa del archivo de imagen
   * @param quality Calidad de compresión (1-100, default: 85)
   * @returns Ruta del archivo WebP convertido
   */
  async convertToWebP(
    filePath: string,
    quality: number = 85,
  ): Promise<string> {
    try {
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`Archivo no encontrado: ${filePath}`);
      }

      // Obtener información del archivo
      const ext = path.extname(filePath).toLowerCase();
      const baseName = path.basename(filePath, ext);
      const dir = path.dirname(filePath);

      // Si ya es WebP, retornar la ruta original
      if (ext === '.webp') {
        this.logger.debug(`Archivo ya es WebP: ${filePath}`);
        return filePath;
      }

      // Verificar que es una imagen válida
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
      if (!imageExtensions.includes(ext)) {
        throw new Error(`Formato de imagen no soportado: ${ext}`);
      }

      // Crear ruta del archivo WebP
      const webpPath = path.join(dir, `${baseName}.webp`);

      // Convertir a WebP usando sharp
      await sharp(filePath)
        .webp({ quality, effort: 6 }) // effort: 0-6, mayor esfuerzo = mejor compresión pero más lento
        .toFile(webpPath);

      // Obtener tamaños para logging
      const originalStats = fs.statSync(filePath);
      const webpStats = fs.statSync(webpPath);
      const reduction = ((1 - webpStats.size / originalStats.size) * 100).toFixed(2);

      this.logger.log(
        `Imagen convertida: ${path.basename(filePath)} → ${path.basename(webpPath)} ` +
        `(${this.formatBytes(originalStats.size)} → ${this.formatBytes(webpStats.size)}, ` +
        `-${reduction}%)`,
      );

      // Eliminar el archivo original si la conversión fue exitosa
      fs.unlinkSync(filePath);
      this.logger.debug(`Archivo original eliminado: ${filePath}`);

      return webpPath;
    } catch (error) {
      this.logger.error(`Error al convertir imagen ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Convierte un buffer de imagen a WebP
   * @param buffer Buffer de la imagen
   * @param quality Calidad de compresión (1-100, default: 85)
   * @returns Buffer de la imagen WebP
   */
  async convertBufferToWebP(
    buffer: Buffer,
    quality: number = 85,
  ): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .webp({ quality, effort: 6 })
        .toBuffer();
    } catch (error) {
      this.logger.error('Error al convertir buffer a WebP:', error);
      throw error;
    }
  }

  /**
   * Verifica si un archivo es una imagen
   */
  isImageFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];
    return imageExtensions.includes(ext);
  }

  /**
   * Formatea bytes a formato legible
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

