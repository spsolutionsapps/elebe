const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function diagnoseProducts() {
  try {
    console.log('🔍 Diagnóstico del endpoint de productos...');
    
    // 1. Verificar conexión a la base de datos
    console.log('\n1. Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa');
    
    // 2. Verificar estructura de la tabla Product
    console.log('\n2. Verificando estructura de la tabla Product...');
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'Product' 
      ORDER BY ordinal_position;
    `;
    console.log('📋 Estructura de la tabla Product:');
    console.table(tableInfo);
    
    // 3. Verificar productos existentes
    console.log('\n3. Verificando productos existentes...');
    const products = await prisma.product.findMany({
      take: 5, // Solo los primeros 5 para no saturar la consola
    });
    console.log(`📦 Total de productos encontrados: ${products.length}`);
    if (products.length > 0) {
      console.log('📋 Primeros productos:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ID: ${product.id}`);
        console.log(`   Nombre: ${product.name}`);
        console.log(`   Categoría: ${product.category || 'NULL'}`);
        console.log(`   Activo: ${product.isActive}`);
        console.log('---');
      });
    }
    
    // 4. Probar consulta específica del endpoint
    console.log('\n4. Probando consulta del endpoint...');
    const activeProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`✅ Consulta exitosa: ${activeProducts.length} productos activos encontrados`);
    
  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseProducts();
