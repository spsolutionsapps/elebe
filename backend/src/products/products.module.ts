import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [ProductsController],
  providers: [PrismaService, CacheService],
})
export class ProductsModule {}
