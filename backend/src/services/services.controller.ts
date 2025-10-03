import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Controller('services')
export class ServicesController {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {}
  
  @Get()
  async findAll() {
    const cacheKey = 'services:all:active';
    const cached = this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const services = await this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    // Cache for 10 minutes
    this.cacheService.set(cacheKey, services, 10 * 60 * 1000);
    
    return services;
  }

  @Get('admin')
  async findAllForAdmin() {
    const cacheKey = 'services:all:admin';
    const cached = this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const services = await this.prisma.service.findMany({
      orderBy: { order: 'asc' },
    });

    // Cache for 5 minutes
    this.cacheService.set(cacheKey, services, 5 * 60 * 1000);
    
    return services;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
    });
    
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return service;
  }

  @Post()
  async create(@Body() data: { 
    title: string; 
    description: string; 
    image?: string;
    order?: number;
  }) {
    const service = await this.prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image || null,
        order: data.order || 0,
        isActive: true,
      },
    });

    // Invalidate cache
    this.cacheService.delete('services:all:active');
    this.cacheService.delete('services:all:admin');
    
    return service;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: { 
    title: string; 
    description: string; 
    image?: string;
    order?: number;
    isActive?: boolean;
  }) {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
    });
    
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const updatedService = await this.prisma.service.update({
      where: { id: id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image || null,
        order: data.order !== undefined ? data.order : service.order,
        isActive: data.isActive !== undefined ? data.isActive : service.isActive,
      },
    });

    // Invalidate cache
    this.cacheService.delete('services:all:active');
    this.cacheService.delete('services:all:admin');
    this.cacheService.delete(`services:${id}`);
    
    return updatedService;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
    });
    
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const deletedService = await this.prisma.service.delete({
      where: { id: id },
    });

    // Invalidate cache
    this.cacheService.delete('services:all:active');
    this.cacheService.delete('services:all:admin');
    this.cacheService.delete(`services:${id}`);
    
    return deletedService;
  }
}
