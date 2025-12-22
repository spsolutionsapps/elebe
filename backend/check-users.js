const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Verificando usuarios en la base de datos...\n');

    const users = await prisma.user.findMany();

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
    } else {
      console.log(`✅ Encontrados ${users.length} usuario(s):`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Rol: ${user.role}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Nombre: ${user.name || 'Sin nombre'}`);
        console.log(`   Creado: ${user.createdAt}`);
        console.log(`   Tiene contraseña: ${user.password ? 'Sí' : 'No'}`);
        console.log('');
      });
    }

    // Buscar específicamente el usuario admin
    const adminUser = await prisma.user.findUnique({
      where: { email: 'elebe.merch@gmail.com' }
    });

    if (adminUser) {
      console.log('✅ Usuario elebe.merch@gmail.com encontrado:');
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Rol: ${adminUser.role}`);
      console.log(`   Nombre: ${adminUser.name}`);
      console.log(`   Tiene contraseña: ${adminUser.password ? 'Sí' : 'No'}`);
    } else {
      console.log('❌ Usuario elebe.merch@gmail.com NO encontrado');
    }

  } catch (error) {
    console.error('❌ Error al verificar usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
