const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testLogin() {
  const prisma = new PrismaClient();

  try {
    console.log('🔐 Probando login del usuario elebe.merch@gmail.com...\n');

    const email = 'elebe.merch@gmail.com';
    const password = 'u1u2u3u4u5';

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    if (!user.password) {
      console.log('❌ Usuario no tiene contraseña configurada');
      return;
    }

    console.log('✅ Usuario encontrado:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Nombre: ${user.name}`);

    // Probar comparación de contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      console.log('✅ Contraseña correcta - Login debería funcionar');
    } else {
      console.log('❌ Contraseña incorrecta');

      // Intentar con otras posibles contraseñas para debug
      const testPasswords = ['admin', 'password', '123456', 'u1u2u3u4u5'];
      console.log('\n🔍 Probando otras contraseñas posibles:');

      for (const testPass of testPasswords) {
        const isValid = await bcrypt.compare(testPass, user.password);
        console.log(`   ${testPass}: ${isValid ? '✅ Correcta' : '❌ Incorrecta'}`);
      }
    }

  } catch (error) {
    console.error('❌ Error al probar login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
