import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesSimpleController } from './services-simple.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [ServicesController, ServicesSimpleController],
  providers: [PrismaService, CacheService],
})
export class ServicesModule {}
