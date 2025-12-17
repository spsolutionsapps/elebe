/**
 * Script para convertir todas las imágenes existentes a WebP
 * 
 * Uso:
 *   npm run convert-images
 * 
 * Este script:
 * 1. Busca todas las imágenes en el directorio ./uploads
 * 2. Convierte PNG, JPG, JPEG, GIF a WebP
 * 3. Elimina los archivos originales después de la conversión exitosa
 * 4. Genera un reporte de conversión
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

interface ConversionResult {
  original: string;
  converted: string;
  originalSize: number;
  convertedSize: number;
  reduction: number;
  success: boolean;
  error?: string;
}

class ImageConverter {
  private uploadsDir: string;
  private results: ConversionResult[] = [];

  constructor() {
    // Determinar la ruta del directorio de uploads
    const scriptDir = __dirname;
    const backendDir = path.resolve(scriptDir, '..');
    this.uploadsDir = path.join(backendDir, 'uploads');
  }

  /**
   * Verifica si un archivo es una imagen que necesita conversión
   */
  private isImageToConvert(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
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

  /**
   * Convierte una imagen a WebP
   */
  private async convertImage(filePath: string): Promise<ConversionResult> {
    const filename = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const baseName = path.basename(filePath, ext);
    const dir = path.dirname(filePath);
    const webpPath = path.join(dir, `${baseName}.webp`);

    try {
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error('Archivo no encontrado');
      }

      // Obtener tamaño original
      const originalStats = fs.statSync(filePath);
      const originalSize = originalStats.size;

      // Convertir a WebP
      await sharp(filePath)
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);

      // Obtener tamaño convertido
      const webpStats = fs.statSync(webpPath);
      const convertedSize = webpStats.size;
      const reduction = ((1 - convertedSize / originalSize) * 100);

      // Eliminar archivo original
      fs.unlinkSync(filePath);

      return {
        original: filename,
        converted: `${baseName}.webp`,
        originalSize,
        convertedSize,
        reduction,
        success: true,
      };
    } catch (error) {
      return {
        original: filename,
        converted: '',
        originalSize: 0,
        convertedSize: 0,
        reduction: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Procesa todas las imágenes en el directorio
   */
  async convertAll(): Promise<void> {
    console.log('🖼️  Iniciando conversión de imágenes a WebP...\n');
    console.log(`📁 Directorio: ${this.uploadsDir}\n`);

    // Verificar que el directorio existe
    if (!fs.existsSync(this.uploadsDir)) {
      console.error(`❌ Error: El directorio ${this.uploadsDir} no existe.`);
      process.exit(1);
    }

    // Leer todos los archivos del directorio
    const files = fs.readdirSync(this.uploadsDir);
    const imageFiles = files.filter(file => {
      const filePath = path.join(this.uploadsDir, file);
      return fs.statSync(filePath).isFile() && this.isImageToConvert(file);
    });

    if (imageFiles.length === 0) {
      console.log('✅ No se encontraron imágenes para convertir.');
      return;
    }

    console.log(`📊 Encontradas ${imageFiles.length} imagen(es) para convertir.\n`);

    // Convertir cada imagen
    let processed = 0;
    for (const file of imageFiles) {
      processed++;
      const filePath = path.join(this.uploadsDir, file);
      console.log(`[${processed}/${imageFiles.length}] Convirtiendo: ${file}...`);

      const result = await this.convertImage(filePath);
      this.results.push(result);

      if (result.success) {
        console.log(
          `   ✅ Convertido: ${result.converted} ` +
          `(${this.formatBytes(result.originalSize)} → ${this.formatBytes(result.convertedSize)}, ` +
          `-${result.reduction.toFixed(2)}%)`,
        );
      } else {
        console.log(`   ❌ Error: ${result.error}`);
      }
    }

    // Generar reporte
    this.generateReport();
  }

  /**
   * Genera un reporte de la conversión
   */
  private generateReport(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE DE CONVERSIÓN');
    console.log('='.repeat(60));

    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);

    if (successful.length > 0) {
      const totalOriginalSize = successful.reduce((sum, r) => sum + r.originalSize, 0);
      const totalConvertedSize = successful.reduce((sum, r) => sum + r.convertedSize, 0);
      const totalReduction = ((1 - totalConvertedSize / totalOriginalSize) * 100);

      console.log(`\n✅ Conversiones exitosas: ${successful.length}`);
      console.log(`   Tamaño original total: ${this.formatBytes(totalOriginalSize)}`);
      console.log(`   Tamaño convertido total: ${this.formatBytes(totalConvertedSize)}`);
      console.log(`   Reducción total: ${totalReduction.toFixed(2)}%`);
      console.log(`   Espacio ahorrado: ${this.formatBytes(totalOriginalSize - totalConvertedSize)}`);
    }

    if (failed.length > 0) {
      console.log(`\n❌ Conversiones fallidas: ${failed.length}`);
      failed.forEach(result => {
        console.log(`   - ${result.original}: ${result.error}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Conversión completada!');
    console.log('='.repeat(60) + '\n');
  }
}

// Ejecutar el script
const converter = new ImageConverter();
converter.convertAll().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

