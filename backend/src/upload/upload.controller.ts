import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ImageConversionService } from './image-conversion.service';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly imageConversionService: ImageConversionService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Aceptar imágenes y videos
        const isImage = file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/);
        const isVideo = file.mimetype.match(/\/(mp4|webm|mov|quicktime)$/);
        
        if (!isImage && !isVideo) {
          return callback(new BadRequestException('Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP) o video (MP4, WEBM, MOV)'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB para videos
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    this.logger.log(`📤 Upload recibido: ${file.filename} (${file.mimetype}, ${file.size} bytes)`);

    // Si es una imagen (no video), convertir automáticamente a WebP
    const isImage = file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/);
    let finalFilename = file.filename;
    let finalImageUrl = `/uploads/${file.filename}`;

    this.logger.debug(`🔍 Verificando conversión: isImage=${!!isImage}, isImageFile=${this.imageConversionService.isImageFile(file.filename)}`);

    if (isImage && this.imageConversionService.isImageFile(file.filename)) {
      try {
        this.logger.log(`🔄 Iniciando conversión a WebP: ${file.filename}`);
        const filePath = join('./uploads', file.filename);
        const webpPath = await this.imageConversionService.convertToWebP(filePath, 85);
        finalFilename = file.filename.replace(extname(file.filename), '.webp');
        finalImageUrl = `/uploads/${finalFilename}`;
        this.logger.log(`✅ Conversión exitosa: ${finalImageUrl}`);
      } catch (error) {
        // Si falla la conversión, continuar con el archivo original
        this.logger.error(`❌ Error al convertir imagen a WebP: ${error instanceof Error ? error.message : error}`);
        if (error instanceof Error && error.stack) {
          this.logger.error(`Stack trace: ${error.stack}`);
        }
      }
    } else {
      this.logger.debug(`⏭️  No se convierte: ${!isImage ? 'no es imagen' : 'ya es WebP o formato no soportado'}`);
    }

    return {
      message: 'Imagen subida exitosamente',
      imageUrl: finalImageUrl,
    };
  }
}
