import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesSimpleController } from './services-simple.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ServicesController, ServicesSimpleController],
  providers: [PrismaService],
})
export class ServicesModule {}
