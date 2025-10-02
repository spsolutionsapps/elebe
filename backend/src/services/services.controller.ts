import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('services')
export class ServicesController {
  constructor(private prisma: PrismaService) {}
  
  @Get()
  async findAll() {
    return await this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  @Get('admin')
  async findAllForAdmin() {
    return await this.prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
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
    return await this.prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image || null,
        order: data.order || 0,
        isActive: true,
      },
    });
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

    return await this.prisma.service.update({
      where: { id: id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image || null,
        order: data.order !== undefined ? data.order : service.order,
        isActive: data.isActive !== undefined ? data.isActive : service.isActive,
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
    });
    
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return await this.prisma.service.delete({
      where: { id: id },
    });
  }
}
