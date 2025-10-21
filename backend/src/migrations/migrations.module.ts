import { Module } from '@nestjs/common';
import { MigrationsController } from './migrations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MigrationsController],
})
export class MigrationsModule {}
