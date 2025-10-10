import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [NewsletterController],
  providers: [PrismaService, CacheService],
})
export class NewsletterModule {}

