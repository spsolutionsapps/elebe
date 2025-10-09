import { Module } from '@nestjs/common';
import { SlidesController } from './slides.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [SlidesController],
  providers: [PrismaService, CacheService],
})
export class SlidesModule {}
