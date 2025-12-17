/**
 * Script de diagnóstico para ver qué referencias de imágenes hay en la BD
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function checkReferences() {
  console.log('🔍 Verificando TODAS las referencias de imágenes en la base de datos...\n');

  // Verificar productos
  const products = await prisma.product.findMany({
    select: { id: true, name: true, image: true, images: true },
  });

  console.log(`📦 Productos (${products.length}):`);
  products.forEach(p => {
    console.log(`   - ${p.name}:`);
    if (p.image) {
      console.log(`     image: ${p.image} ${/\.(png|jpg|jpeg|gif)$/i.test(p.image) ? '⚠️ PNG/JPG' : ''}`);
    }
    if (p.images && p.images.length > 0) {
      p.images.forEach((img, idx) => {
        console.log(`     images[${idx}]: ${img} ${/\.(png|jpg|jpeg|gif)$/i.test(img) ? '⚠️ PNG/JPG' : ''}`);
      });
    }
  });

  // Verificar slides
  const slides = await prisma.slide.findMany({
    select: { id: true, title: true, image: true, mobileImage: true },
  });

  console.log(`\n🎬 Slides (${slides.length}):`);
  slides.forEach(s => {
    console.log(`   - ${s.title || s.id}:`);
    if (s.image) {
      console.log(`     image: ${s.image} ${/\.(png|jpg|jpeg|gif)$/i.test(s.image) ? '⚠️ PNG/JPG' : ''}`);
    }
    if (s.mobileImage) {
      console.log(`     mobileImage: ${s.mobileImage} ${/\.(png|jpg|jpeg|gif)$/i.test(s.mobileImage) ? '⚠️ PNG/JPG' : ''}`);
    }
  });

  // Verificar marcas
  const brands = await prisma.brand.findMany({
    select: { id: true, name: true, logo: true },
  });

  console.log(`\n🏷️  Marcas (${brands.length}):`);
  brands.forEach(b => {
    if (b.logo) {
      console.log(`   - ${b.name}: ${b.logo} ${/\.(png|jpg|jpeg|gif)$/i.test(b.logo) ? '⚠️ PNG/JPG' : ''}`);
    }
  });

  // Verificar categorías
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, image: true },
  });

  console.log(`\n📂 Categorías (${categories.length}):`);
  categories.forEach(c => {
    if (c.image && /\.(png|jpg|jpeg|gif)$/i.test(c.image)) {
      console.log(`   - ${c.name}: ${c.image}`);
    }
  });

  // Verificar about
  const abouts = await prisma.about.findMany({
    select: { id: true, title: true, images: true },
  });

  console.log(`\n📄 About (${abouts.length}):`);
  abouts.forEach(a => {
    if (a.images && a.images.length > 0) {
      a.images.forEach(img => {
        if (/\.(png|jpg|jpeg|gif)$/i.test(img)) {
          console.log(`   - ${a.title || a.id}: ${img}`);
        }
      });
    }
  });

  await prisma.$disconnect();
}

checkReferences().catch(console.error);

