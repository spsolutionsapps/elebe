import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AboutController],
  providers: [PrismaService],
})
export class AboutModule {}
