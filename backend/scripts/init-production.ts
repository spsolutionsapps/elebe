import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando inicialización de producción...');

  try {
    // Verificar conexión a la base de datos
    console.log('🔍 Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');

    // Ejecutar migraciones
    console.log('📊 Aplicando migraciones...');
    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      console.log('✅ Migraciones aplicadas exitosamente');
    } catch (error) {
      console.error('❌ Error al aplicar migraciones:', error);
      throw error;
    }

    // Generar cliente Prisma
    console.log('🔧 Generando cliente Prisma...');
    try {
      execSync('npx prisma generate', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      console.log('✅ Cliente Prisma generado exitosamente');
    } catch (error) {
      console.warn('⚠️ Advertencia al generar cliente Prisma:', error.message);
      console.log('Continuando con el proceso (el cliente podría ya existir)...');
    }

    // Ejecutar seed
    console.log('🌱 Ejecutando seed de datos iniciales...');
    try {
      execSync('npx tsx scripts/seed.ts', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      console.log('✅ Seed completado exitosamente');
    } catch (error) {
      console.error('❌ Error durante el seed:', error);
      throw error;
    }

    console.log('🎉 Inicialización de producción completada exitosamente!');
    console.log('');
    console.log('Credenciales de administrador:');
    console.log('📧 Email:', process.env.ADMIN_EMAIL || 'admin@elebe.com');
    console.log('🔑 Contraseña: [configurada en variables de entorno]');
    console.log('👤 Rol: admin');

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();