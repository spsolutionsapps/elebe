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
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
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
