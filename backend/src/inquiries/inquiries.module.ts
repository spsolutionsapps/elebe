import { Module } from '@nestjs/common';
import { InquiriesController } from './inquiries.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [InquiriesController],
  providers: [PrismaService, CacheService],
})
export class InquiriesModule {}
