/**
 * Script para actualizar referencias de imágenes en la base de datos
 * 
 * Uso:
 *   npm run update-image-refs
 * 
 * Este script:
 * 1. Busca todas las referencias a imágenes en la base de datos
 * 2. Reemplaza extensiones .png, .jpg, .jpeg, .gif por .webp
 * 3. Actualiza las tablas: Product, Slide, About, Brand, Category, CartItem
 * 
 * IMPORTANTE: Ejecuta primero convert-images-to-webp.ts para convertir las imágenes físicas
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

interface UpdateResult {
  table: string;
  field: string;
  updated: number;
  errors: number;
}

class DatabaseImageReferenceUpdater {
  private prisma: PrismaClient;
  private results: UpdateResult[] = [];

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Reemplaza extensiones de imagen en una cadena
   */
  private replaceImageExtension(value: string): string {
    if (!value) return value;
    
    // Reemplazar extensiones comunes por .webp (busca en cualquier parte de la cadena)
    return value
      .replace(/\.png(\?|$)/gi, '.webp$1')
      .replace(/\.jpg(\?|$)/gi, '.webp$1')
      .replace(/\.jpeg(\?|$)/gi, '.webp$1')
      .replace(/\.gif(\?|$)/gi, '.webp$1')
      .replace(/\.bmp(\?|$)/gi, '.webp$1')
      .replace(/\.tiff(\?|$)/gi, '.webp$1');
  }

  /**
   * Actualiza referencias en la tabla Product
   */
  async updateProducts(): Promise<UpdateResult> {
    console.log('📦 Actualizando productos...');
    let updated = 0;
    let errors = 0;

    try {
      const products = await this.prisma.product.findMany({
        select: { id: true, image: true, images: true },
      });

      for (const product of products) {
        try {
          const updates: any = {};
          let needsUpdate = false;

          // Actualizar campo image
          if (product.image) {
            const newImage = this.replaceImageExtension(product.image);
            if (newImage !== product.image) {
              console.log(`   🔄 Producto ${product.id}: ${product.image} → ${newImage}`);
              updates.image = newImage;
              needsUpdate = true;
            }
          }

          // Actualizar array images
          if (product.images && product.images.length > 0) {
            const newImages = product.images.map(img => this.replaceImageExtension(img));
            const hasChanges = newImages.some((img, idx) => img !== product.images[idx]);
            if (hasChanges) {
              product.images.forEach((oldImg, idx) => {
                if (oldImg !== newImages[idx]) {
                  console.log(`   🔄 Producto ${product.id} (array): ${oldImg} → ${newImages[idx]}`);
                }
              });
              updates.images = newImages;
              needsUpdate = true;
            }
          }

          if (needsUpdate) {
            await this.prisma.product.update({
              where: { id: product.id },
              data: updates,
            });
            updated++;
          }
        } catch (error) {
          console.error(`   ❌ Error actualizando producto ${product.id}:`, error);
          errors++;
        }
      }

      console.log(`   ✅ Productos actualizados: ${updated}`);
      return { table: 'Product', field: 'image, images', updated, errors };
    } catch (error) {
      console.error('   ❌ Error al actualizar productos:', error);
      return { table: 'Product', field: 'image, images', updated: 0, errors: 1 };
    }
  }

  /**
   * Actualiza referencias en la tabla Slide
   */
  async updateSlides(): Promise<UpdateResult> {
    console.log('🎬 Actualizando slides...');
    let updated = 0;
    let errors = 0;

    try {
      const slides = await this.prisma.slide.findMany({
        select: { id: true, image: true, mobileImage: true },
      });

      for (const slide of slides) {
        try {
          const updates: any = {};
          let needsUpdate = false;

          if (slide.image) {
            const newImage = this.replaceImageExtension(slide.image);
            if (newImage !== slide.image) {
              updates.image = newImage;
              needsUpdate = true;
            }
          }

          if (slide.mobileImage) {
            const newMobileImage = this.replaceImageExtension(slide.mobileImage);
            if (newMobileImage !== slide.mobileImage) {
              updates.mobileImage = newMobileImage;
              needsUpdate = true;
            }
          }

          if (needsUpdate) {
            await this.prisma.slide.update({
              where: { id: slide.id },
              data: updates,
            });
            updated++;
          }
        } catch (error) {
          console.error(`   ❌ Error actualizando slide ${slide.id}:`, error);
          errors++;
        }
      }

      console.log(`   ✅ Slides actualizados: ${updated}`);
      return { table: 'Slide', field: 'image, mobileImage', updated, errors };
    } catch (error) {
      console.error('   ❌ Error al actualizar slides:', error);
      return { table: 'Slide', field: 'image, mobileImage', updated: 0, errors: 1 };
    }
  }

  /**
   * Actualiza referencias en la tabla About
   */
  async updateAbout(): Promise<UpdateResult> {
    console.log('📄 Actualizando about...');
    let updated = 0;
    let errors = 0;

    try {
      const abouts = await this.prisma.about.findMany({
        select: { id: true, images: true },
      });

      for (const about of abouts) {
        try {
          if (about.images && about.images.length > 0) {
            const newImages = about.images.map(img => this.replaceImageExtension(img));
            const hasChanges = newImages.some((img, idx) => img !== about.images[idx]);

            if (hasChanges) {
              await this.prisma.about.update({
                where: { id: about.id },
                data: { images: newImages },
              });
              updated++;
            }
          }
        } catch (error) {
          console.error(`   ❌ Error actualizando about ${about.id}:`, error);
          errors++;
        }
      }

      console.log(`   ✅ About actualizados: ${updated}`);
      return { table: 'About', field: 'images', updated, errors };
    } catch (error) {
      console.error('   ❌ Error al actualizar about:', error);
      return { table: 'About', field: 'images', updated: 0, errors: 1 };
    }
  }

  /**
   * Actualiza referencias en la tabla Brand
   */
  async updateBrands(): Promise<UpdateResult> {
    console.log('🏷️  Actualizando marcas...');
    let updated = 0;
    let errors = 0;

    try {
      const brands = await this.prisma.brand.findMany({
        select: { id: true, logo: true },
      });

      for (const brand of brands) {
        try {
          if (brand.logo) {
            const newLogo = this.replaceImageExtension(brand.logo);
            if (newLogo !== brand.logo) {
              await this.prisma.brand.update({
                where: { id: brand.id },
                data: { logo: newLogo },
              });
              updated++;
            }
          }
        } catch (error) {
          console.error(`   ❌ Error actualizando marca ${brand.id}:`, error);
          errors++;
        }
      }

      console.log(`   ✅ Marcas actualizadas: ${updated}`);
      return { table: 'Brand', field: 'logo', updated, errors };
    } catch (error) {
      console.error('   ❌ Error al actualizar marcas:', error);
      return { table: 'Brand', field: 'logo', updated: 0, errors: 1 };
    }
  }

  /**
   * Actualiza referencias en la tabla Category
   */
  async updateCategories(): Promise<UpdateResult> {
    console.log('📂 Actualizando categorías...');
    let updated = 0;
    let errors = 0;

    try {
      const categories = await this.prisma.category.findMany({
        select: { id: true, image: true },
      });

      for (const category of categories) {
        try {
          if (category.image) {
            const newImage = this.replaceImageExtension(category.image);
            if (newImage !== category.image) {
              await this.prisma.category.update({
                where: { id: category.id },
                data: { image: newImage },
              });
              updated++;
            }
          }
        } catch (error) {
          console.error(`   ❌ Error actualizando categoría ${category.id}:`, error);
          errors++;
        }
      }

      console.log(`   ✅ Categorías actualizadas: ${updated}`);
      return { table: 'Category', field: 'image', updated, errors };
    } catch (error) {
      console.error('   ❌ Error al actualizar categorías:', error);
      return { table: 'Category', field: 'image', updated: 0, errors: 1 };
    }
  }

  /**
   * Actualiza referencias en la tabla CartItem
   */
  async updateCartItems(): Promise<UpdateResult> {
    console.log('🛒 Actualizando items del carrito...');
    let updated = 0;
    let errors = 0;

    try {
      const cartItems = await this.prisma.cartItem.findMany({
        select: { id: true, image: true },
      });

      for (const item of cartItems) {
        try {
          if (item.image) {
            const newImage = this.replaceImageExtension(item.image);
            if (newImage !== item.image) {
              await this.prisma.cartItem.update({
                where: { id: item.id },
                data: { image: newImage },
              });
              updated++;
            }
          }
        } catch (error) {
          console.error(`   ❌ Error actualizando cart item ${item.id}:`, error);
          errors++;
        }
      }

      console.log(`   ✅ Cart items actualizados: ${updated}`);
      return { table: 'CartItem', field: 'image', updated, errors };
    } catch (error) {
      console.error('   ❌ Error al actualizar cart items:', error);
      return { table: 'CartItem', field: 'image', updated: 0, errors: 1 };
    }
  }

  /**
   * Ejecuta todas las actualizaciones
   */
  async updateAll(): Promise<void> {
    console.log('🔄 Iniciando actualización de referencias de imágenes en la base de datos...\n');

    try {
      // Actualizar cada tabla
      this.results.push(await this.updateProducts());
      this.results.push(await this.updateSlides());
      this.results.push(await this.updateAbout());
      this.results.push(await this.updateBrands());
      this.results.push(await this.updateCategories());
      this.results.push(await this.updateCartItems());

      // Generar reporte
      this.generateReport();
    } catch (error) {
      console.error('❌ Error fatal:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  /**
   * Genera un reporte de las actualizaciones
   */
  private generateReport(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE DE ACTUALIZACIÓN');
    console.log('='.repeat(60));

    const totalUpdated = this.results.reduce((sum, r) => sum + r.updated, 0);
    const totalErrors = this.results.reduce((sum, r) => sum + r.errors, 0);

    console.log(`\n✅ Total de registros actualizados: ${totalUpdated}`);
    console.log(`❌ Total de errores: ${totalErrors}\n`);

    this.results.forEach(result => {
      console.log(`   ${result.table} (${result.field}): ${result.updated} actualizados`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✨ Actualización completada!');
    console.log('='.repeat(60) + '\n');
  }
}

// Ejecutar el script
const updater = new DatabaseImageReferenceUpdater();
updater.updateAll().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

