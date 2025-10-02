import { Module } from '@nestjs/common';
import { SlidesController } from './slides.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SlidesController],
  providers: [PrismaService],
})
export class SlidesModule {}
