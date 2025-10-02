const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateProductsCategory() {
  try {
    console.log('🔄 Actualizando categorías de productos existentes...');
    
    // Obtener todos los productos que no tienen categoría o tienen categoría null
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { category: null },
          { category: '' }
        ]
      }
    });

    console.log(`📦 Encontrados ${products.length} productos sin categoría`);

    // Actualizar cada producto con categoría "General"
    for (const product of products) {
      await prisma.product.update({
        where: { id: product.id },
        data: { category: 'General' }
      });
      console.log(`✅ Producto "${product.name}" actualizado con categoría "General"`);
    }

    console.log('🎉 Todos los productos han sido actualizados correctamente');
    
  } catch (error) {
    console.error('❌ Error actualizando productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductsCategory();
