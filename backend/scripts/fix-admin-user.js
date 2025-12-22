const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function fixAdminUser() {
  const prisma = new PrismaClient();

  try {
    console.log('🔧 Solucionando usuario administrador...\n');

    const adminEmail = process.env.ADMIN_EMAIL || 'elebe.merch@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'u1u2u3u4u5';
    const adminName = process.env.ADMIN_NAME || 'Administrador Elebe';

    console.log(`📧 Email configurado: ${adminEmail}`);
    console.log(`🔑 Contraseña configurada: ${adminPassword ? '[CONFIGURADA]' : '[POR DEFECTO]'}`);

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    if (existingUser) {
      console.log('✅ Usuario encontrado, actualizando...');
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          name: adminName,
          role: 'admin',
        }
      });
      console.log('✅ Usuario administrador actualizado');
    } else {
      console.log('📦 Usuario no encontrado, creando...');
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: 'admin',
        }
      });
      console.log('✅ Usuario administrador creado');
    }

    // Verificar el resultado
    const user = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    console.log('\n✅ Usuario administrador configurado:');
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Nombre: ${user.name}`);
    console.log(`   👑 Rol: ${user.role}`);
    console.log(`   🔐 Tiene contraseña: ${user.password ? 'Sí' : 'No'}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminUser();
