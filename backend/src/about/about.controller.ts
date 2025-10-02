import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('about')
export class AboutController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return await this.prisma.about.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const about = await this.prisma.about.findUnique({
      where: { id: id },
    });
    
    if (!about) {
      throw new NotFoundException('Información no encontrada');
    }

    return about;
  }

  @Post()
  async create(@Body() data: { title: string; content: string; images?: string[] }) {
    return await this.prisma.about.create({
      data: {
        title: data.title,
        content: data.content,
        images: data.images || [],
        isActive: true,
      },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: { title: string; content: string; images?: string[] }) {
    const about = await this.prisma.about.findUnique({
      where: { id: id },
    });
    
    if (!about) {
      throw new NotFoundException('Información no encontrada');
    }

    return await this.prisma.about.update({
      where: { id: id },
      data: {
        title: data.title,
        content: data.content,
        images: data.images || [],
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const about = await this.prisma.about.findUnique({
      where: { id: id },
    });
    
    if (!about) {
      throw new NotFoundException('Información no encontrada');
    }

    return await this.prisma.about.delete({
      where: { id: id },
    });
  }
}
