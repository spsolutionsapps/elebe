import { Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('migrations')
export class MigrationsController {
  constructor(private prisma: PrismaService) {}

  @Post('apply')
  async applyMigrations() {
    try {
      console.log('🚀 Verificando estado de las migraciones...');
      
      // Verificar si las tablas existen probando una consulta simple
      let categoryExists = false;
      let serviceExists = false;

      try {
        await this.prisma.category.findFirst();
        categoryExists = true;
        console.log('✅ Tabla Category existe');
      } catch (error) {
        console.log('❌ Tabla Category no existe');
        categoryExists = false;
      }

      try {
        await this.prisma.service.findFirst();
        serviceExists = true;
        console.log('✅ Tabla Service existe');
      } catch (error) {
        console.log('❌ Tabla Service no existe');
        serviceExists = false;
      }

      return {
        success: true,
        message: 'Estado de migraciones verificado',
        categoryExists,
        serviceExists,
        needsMigration: !categoryExists || !serviceExists,
        timestamp: new Date().toISOString(),
        instructions: !categoryExists || !serviceExists ? 
          'Las tablas faltantes necesitan ser creadas. Ejecuta: npx prisma migrate deploy' : 
          'Todas las tablas existen correctamente'
      };

    } catch (error) {
      console.error('❌ Error verificando migraciones:', error);
      throw new HttpException(
        `Error verificando migraciones: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
