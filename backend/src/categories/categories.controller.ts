import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  @Get()
  async findAll() {
    const cacheKey = 'categories:all';
    const cached = this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    this.cacheService.set(cacheKey, categories, 15 * 60 * 1000); // 15 minutos
    return categories;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new HttpException('Categoría no encontrada', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  @Post()
  async create(@Body() data: any) {
    try {
      console.log('🚀 Backend: Creando categoría:', data);

      // Verificar que no exista una categoría con el mismo slug
      const existing = await this.prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        throw new HttpException(
          'Ya existe una categoría con ese slug',
          HttpStatus.BAD_REQUEST,
        );
      }

      const category = await this.prisma.category.create({
        data: {
          name: data.name,
          slug: data.slug,
          image: data.image || null,
          hoverText: data.hoverText || null,
          order: data.order || 0,
          isActive: data.isActive !== undefined ? data.isActive : true,
        },
      });

      console.log('✅ Backend: Categoría creada:', category);

      // Invalidar cache
      this.cacheService.delete('categories:all');

      return {
        message: 'Categoría creada correctamente',
        category,
      };
    } catch (error) {
      console.error('❌ Backend: Error creando categoría:', error);
      throw new HttpException(
        error.message || 'Error al crear la categoría',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      console.log('🚀 Backend: Actualizando categoría:', id, data);

      const existing = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new HttpException(
          'Categoría no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar que no exista otra categoría con el mismo slug
      if (data.slug && data.slug !== existing.slug) {
        const slugExists = await this.prisma.category.findUnique({
          where: { slug: data.slug },
        });

        if (slugExists) {
          throw new HttpException(
            'Ya existe una categoría con ese slug',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const category = await this.prisma.category.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          image: data.image,
          hoverText: data.hoverText,
          order: data.order,
          isActive: data.isActive,
        },
      });

      console.log('✅ Backend: Categoría actualizada:', category);

      // Invalidar cache
      this.cacheService.delete('categories:all');

      return {
        message: 'Categoría actualizada correctamente',
        category,
      };
    } catch (error) {
      console.error('❌ Backend: Error actualizando categoría:', error);
      throw new HttpException(
        error.message || 'Error al actualizar la categoría',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      console.log('🚀 Backend: Eliminando categoría:', id);

      const existing = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new HttpException(
          'Categoría no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.category.delete({
        where: { id },
      });

      console.log('✅ Backend: Categoría eliminada:', id);

      // Invalidar cache
      this.cacheService.delete('categories:all');

      return {
        message: 'Categoría eliminada correctamente',
      };
    } catch (error) {
      console.error('❌ Backend: Error eliminando categoría:', error);
      throw new HttpException(
        error.message || 'Error al eliminar la categoría',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

