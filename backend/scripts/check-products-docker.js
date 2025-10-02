const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const count = await prisma.product.count();
    console.log('📊 Productos en la base de datos:', count);
    
    if (count === 0) {
      console.log('⚠️ No hay productos en la base de datos');
    } else {
      const products = await prisma.product.findMany({
        take: 3,
        select: { id: true, name: true, category: true }
      });
      console.log('📦 Primeros productos:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.category})`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
