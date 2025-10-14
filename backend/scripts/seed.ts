import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear slides
  console.log('📸 Creando slides...');
  const slides = [
    {
      id: 'slide-1',
      title: 'Nueva Colección Primavera',
      subtitle: 'Descubre las últimas tendencias',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      order: 1,
      isActive: true,
    },
    {
      id: 'slide-2',
      title: 'Estilo Elegante',
      subtitle: 'Para ocasiones especiales',
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
      order: 2,
      isActive: true,
    },
    {
      id: 'slide-3',
      title: 'Casual Chic',
      subtitle: 'Comodidad y estilo',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      order: 3,
      isActive: true,
    },
  ];

  for (const slide of slides) {
    await prisma.slide.upsert({
      where: { id: slide.id },
      update: slide,
      create: slide,
    });
  }

  // Crear productos
  console.log('👕 Creando productos...');
  const products = [
    {
      id: 'product-1',
      name: 'Vestido Elegante Negro',
      description: 'Vestido largo negro perfecto para eventos especiales',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
      images: [],
      isActive: true,
    },
    {
      id: 'product-2',
      name: 'Blazer Clásico',
      description: 'Blazer azul marino con corte clásico y elegante',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      images: [],
      isActive: true,
    },
    {
      id: 'product-3',
      name: 'Camisa de Seda',
      description: 'Camisa de seda blanca con detalles elegantes',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      images: [],
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  // Crear servicios
  console.log('🛍️ Creando servicios...');
  const services = [
    {
      id: 'service-1',
      title: 'Asesoría de Estilo',
      description: 'Consulta personalizada para encontrar tu estilo único',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      order: 1,
      isActive: true,
    },
    {
      id: 'service-2',
      title: 'Personalización de Prendas',
      description: 'Adaptamos las prendas a tu medida perfecta',
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
      order: 2,
      isActive: true,
    },
    {
      id: 'service-3',
      title: 'Envío Express',
      description: 'Entrega rápida en 24-48 horas',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      order: 3,
      isActive: true,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: service,
    });
  }

  // Crear información sobre nosotros
  console.log('ℹ️ Creando información sobre nosotros...');
  const abouts = [
    {
      id: 'about-1',
      title: 'Nuestra Historia',
      content: 'Somos una empresa familiar con más de 20 años de experiencia en el mundo de la moda. Nos especializamos en crear prendas únicas y elegantes que reflejen la personalidad de cada cliente.',
      images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'],
      isActive: true,
    },
    {
      id: 'about-2',
      title: 'Nuestra Misión',
      content: 'Proporcionar a nuestros clientes prendas de alta calidad que combinen estilo, comodidad y elegancia, siempre manteniendo los más altos estándares de calidad y servicio.',
      images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400'],
      isActive: true,
    },
  ];

  for (const about of abouts) {
    await prisma.about.upsert({
      where: { id: about.id },
      update: about,
      create: about,
    });
  }

  console.log('✅ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
