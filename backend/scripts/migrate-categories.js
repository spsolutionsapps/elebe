const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapeo de categorías antiguas a nuevas categorías
const categoryMapping = {
  // Categorías antiguas -> Nueva categoría
  'General': 'Oficina',
  'Ropa': 'Moda',
  'Accesorios': 'Merch',
  'Calzado': 'Moda',
  'Bolsos': 'Viajes',
  'Joyas': 'Merch',
  'Relojes': 'Tecnología',
  'Perfumes': 'Merch',
  'Cosméticos': 'Merch',
  'Deportes': 'Deporte',
  'Hogar': 'Oficina',
  'Tecnología': 'Tecnología',
  'Apparel': 'Moda',
  'Apparel - Abrigo': 'Moda',
  'Apparel - Chombas': 'Moda',
  'Apparel - Remeras': 'Moda',
  'Black Edition': 'Moda',
  'Bolsas y Tote Bags': 'Viajes',
  'Bolsos y Mochilas': 'Viajes',
  'Cocina': 'Bebidas',
  'Coolers y luncheras': 'Bebidas',
  'Cuadernos': 'Oficina',
  'Deporte': 'Deporte',
  'Drinkware': 'Bebidas',
  'Escritorio': 'Oficina',
  'Escritura': 'Oficina',
  'Ferias del Agro y Rural': 'Uniformes',
  'Gorros': 'Moda',
  'Hogar y Tiempo Libre': 'Oficina',
  'Hydra Go': 'Bebidas',
  'Llaveros': 'Merch',
  'Logo 24hs': 'Imprenta',
  'Mates, termos y materas': 'Bebidas',
  'Minería': 'Uniformes',
  'Packaging': 'Imprenta',
  'Paraguas': 'Viajes',
  'Primavera': 'Bonus',
  'Próximos Arribos': 'Bonus',
  'Sustentables': 'Bonus',
  'Viajes': 'Viajes',
  '2025 Apparel Sol\'s': 'Moda',
  '2025 Día de la madre': 'Bonus',
  '2025 Felices Fiestas': 'Bonus',
  '2025 Novedades': 'Bonus',
  '2025 Reingresos': 'Bonus'
};

async function migrateCategories() {
  try {
    console.log('🔄 Iniciando migración de categorías...');
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      select: { id: true, name: true, category: true }
    });

    console.log(`📦 Encontrados ${products.length} productos para migrar`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      const currentCategory = product.category || 'General';
      const newCategory = categoryMapping[currentCategory];

      if (newCategory && newCategory !== currentCategory) {
        await prisma.product.update({
          where: { id: product.id },
          data: { category: newCategory }
        });
        console.log(`✅ "${product.name}": ${currentCategory} → ${newCategory}`);
        updatedCount++;
      } else if (!newCategory) {
        // Si no hay mapeo, mantener la categoría actual o asignar a "Oficina" si está vacía
        const finalCategory = currentCategory === 'General' ? 'Oficina' : currentCategory;
        await prisma.product.update({
          where: { id: product.id },
          data: { category: finalCategory }
        });
        console.log(`⚠️  "${product.name}": ${currentCategory} → ${finalCategory} (sin mapeo específico)`);
        updatedCount++;
      } else {
        console.log(`⏭️  "${product.name}": ${currentCategory} (sin cambios)`);
        skippedCount++;
      }
    }

    console.log('\n📊 Resumen de la migración:');
    console.log(`✅ Productos actualizados: ${updatedCount}`);
    console.log(`⏭️  Productos sin cambios: ${skippedCount}`);
    console.log(`📦 Total de productos: ${products.length}`);

    // Mostrar estadísticas por categoría
    console.log('\n📈 Estadísticas por categoría final:');
    const categoryStats = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    categoryStats.forEach(stat => {
      console.log(`   ${stat.category}: ${stat._count.category} productos`);
    });

    console.log('\n🎉 Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
migrateCategories();
