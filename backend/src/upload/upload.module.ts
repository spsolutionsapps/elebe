import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ImageConversionService } from './image-conversion.service';

@Module({
  controllers: [UploadController],
  providers: [ImageConversionService],
  exports: [ImageConversionService],
})
export class UploadModule {}
