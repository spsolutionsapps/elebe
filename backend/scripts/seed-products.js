const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    console.log('🌱 Creando productos de prueba...');
    
    const sampleProducts = [
      {
        name: 'Remera Premium Algodón',
        description: 'Remera de algodón 100% premium, cómoda y duradera. Perfecta para uso diario.',
        category: 'Ropa',
        image: 'remera-premium.jpg',
        images: ['remera-premium-1.jpg', 'remera-premium-2.jpg'],
        price: 25.99,
        isActive: true
      },
      {
        name: 'Bolso de Cuero Genuino',
        description: 'Bolso de cuero genuino artesanal, elegante y funcional para el día a día.',
        category: 'Bolsos',
        image: 'bolso-cuero.jpg',
        images: ['bolso-cuero-1.jpg', 'bolso-cuero-2.jpg'],
        price: 89.99,
        isActive: true
      },
      {
        name: 'Gorra Deportiva',
        description: 'Gorra deportiva con tecnología de secado rápido y protección UV.',
        category: 'Accesorios',
        image: 'gorra-deportiva.jpg',
        images: ['gorra-deportiva-1.jpg'],
        price: 19.99,
        isActive: true
      },
      {
        name: 'Taza Personalizada',
        description: 'Taza de cerámica personalizable con tu logo o diseño preferido.',
        category: 'Hogar',
        image: 'taza-personalizada.jpg',
        images: ['taza-personalizada-1.jpg', 'taza-personalizada-2.jpg'],
        price: 12.50,
        isActive: true
      },
      {
        name: 'Mochila Ejecutiva',
        description: 'Mochila ejecutiva con compartimentos organizados y diseño profesional.',
        category: 'Bolsos',
        image: 'mochila-ejecutiva.jpg',
        images: ['mochila-ejecutiva-1.jpg', 'mochila-ejecutiva-2.jpg'],
        price: 75.00,
        isActive: true
      }
    ];

    for (const productData of sampleProducts) {
      const product = await prisma.product.create({
        data: productData
      });
      console.log(`✅ Producto creado: "${product.name}" (ID: ${product.id})`);
    }

    console.log('\n🎉 Todos los productos de prueba han sido creados correctamente');
    
    // Verificar que se crearon
    const totalProducts = await prisma.product.count();
    console.log(`📊 Total de productos en la base de datos: ${totalProducts}`);
    
  } catch (error) {
    console.error('❌ Error creando productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
