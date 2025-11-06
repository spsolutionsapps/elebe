import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { BrandsService } from './brands.service'
import { CreateBrandDto, UpdateBrandDto } from './dto'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto)
  }

  @Post('with-logo')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          const filename = `brand-${uniqueSuffix}${ext}`
          callback(null, filename)
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
          return callback(new Error('Solo se permiten archivos de imagen'), false)
        }
        callback(null, true)
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  async createWithLogo(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    try {
      // Crear el DTO manualmente para evitar problemas de validación con FormData
      const createBrandDto: CreateBrandDto = {
        name: body.name,
        logo: file ? `/uploads/${file.filename}` : undefined,
        website: body.website && body.website !== '' ? body.website : undefined,
        isActive: body.isActive === 'true' || body.isActive === true,
        order: body.order ? parseInt(body.order, 10) : 0
      }
      
      return this.brandsService.create(createBrandDto)
    } catch (error) {
      console.error('Error creating brand with logo:', error)
      throw error
    }
  }

  @Post('bulk-upload')
  @UseInterceptors(
    FilesInterceptor('logos', 100, { // Máximo 100 archivos
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          const filename = `brand-${uniqueSuffix}${ext}`
          callback(null, filename)
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
          return callback(new Error('Solo se permiten archivos de imagen'), false)
        }
        callback(null, true)
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB por archivo
      },
    })
  )
  async bulkUpload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ) {
    try {
      if (!files || files.length === 0) {
        return {
          message: 'No se recibieron archivos',
          total: 0,
          successCount: 0,
          errorCount: 0,
          results: [],
        }
      }

      const results = []
      let successCount = 0
      let errorCount = 0

      for (const file of files) {
        try {
          const fileName = file.originalname.replace(/\.[^/.]+$/, '')
          const brandName = fileName.replace(/-/g, ' ').replace(/_/g, ' ').trim()

          if (!brandName) {
            results.push({ success: false, name: file.originalname, error: 'Nombre de archivo inválido' })
            errorCount++
            continue
          }

          const createBrandDto: CreateBrandDto = {
            name: brandName,
            logo: `/uploads/${file.filename}`,
            website: undefined,
            isActive: body.isActive === 'true' || body.isActive === true,
            order: 0,
          }

          const brand = await this.brandsService.create(createBrandDto)
          results.push({ success: true, name: brandName, brand })
          successCount++
        } catch (error) {
          results.push({ 
            success: false, 
            name: file.originalname, 
            error: error.message || 'Error desconocido' 
          })
          errorCount++
        }
      }

      return {
        message: `Proceso completado: ${successCount} exitosas, ${errorCount} errores`,
        total: files.length,
        successCount,
        errorCount,
        results,
      }
    } catch (error) {
      console.error('Error en bulk upload:', error)
      throw error
    }
  }

  @Get()
  findAll() {
    return this.brandsService.findAll()
  }

  @Get('active')
  findActive() {
    return this.brandsService.findActive()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id)
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          const filename = `brand-${uniqueSuffix}${ext}`
          callback(null, filename)
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
          return callback(new Error('Solo se permiten archivos de imagen'), false)
        }
        callback(null, true)
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      // Crear el DTO manualmente para evitar problemas de validación con FormData
      const updateBrandDto: UpdateBrandDto = {
        name: body.name,
        logo: file ? `/uploads/${file.filename}` : undefined,
        website: body.website && body.website !== '' ? body.website : undefined,
        isActive: body.isActive === 'true' || body.isActive === true,
        order: body.order ? parseInt(body.order, 10) : undefined
      }
      
      return this.brandsService.update(id, updateBrandDto)
    } catch (error) {
      console.error('Error updating brand:', error)
      throw error
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id)
  }

  @Patch('reorder')
  reorder(@Body() body: { brandIds: string[] }) {
    return this.brandsService.reorder(body.brandIds)
  }
}
