import { Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('migrations')
export class MigrationsController {
  constructor(private prisma: PrismaService) {}

  @Post('apply')
  async applyMigrations() {
    try {
      console.log('🚀 Aplicando migraciones automáticamente...');
      
      // Verificar si la tabla Category existe
      const categoryTableExists = await this.checkTableExists('Category');
      
      if (!categoryTableExists) {
        console.log('📝 Creando tabla Category...');
        await this.createCategoryTable();
        console.log('✅ Tabla Category creada');
      } else {
        console.log('✅ Tabla Category ya existe');
      }

      // Verificar si la tabla Service existe
      const serviceTableExists = await this.checkTableExists('Service');
      
      if (!serviceTableExists) {
        console.log('📝 Creando tabla Service...');
        await this.createServiceTable();
        console.log('✅ Tabla Service creada');
      } else {
        console.log('✅ Tabla Service ya existe');
      }

      return {
        success: true,
        message: 'Migraciones aplicadas exitosamente',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error aplicando migraciones:', error);
      throw new HttpException(
        `Error aplicando migraciones: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async checkTableExists(tableName: string): Promise<boolean> {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${tableName}
        );
      `;
      return (result as any)[0].exists;
    } catch (error) {
      console.error(`Error verificando tabla ${tableName}:`, error);
      return false;
    }
  }

  private async createCategoryTable() {
    await this.prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "public"."Category" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "image" TEXT,
        "hoverText" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
      );
    `;

    await this.prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "public"."Category"("name");
    `;

    await this.prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "public"."Category"("slug");
    `;
  }

  private async createServiceTable() {
    await this.prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "public"."Service" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "image" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
      );
    `;
  }
}
