import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('slides')
export class SlidesController {
  constructor(private prisma: PrismaService) {}
  
  @Get()
  async findAll() {
    try {
      console.log('🔍 Fetching slides...');
      const slides = await this.prisma.slide.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });
      console.log('📊 Slides found:', slides.length, slides);
      return slides;
    } catch (error) {
      console.error('❌ Error fetching slides:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const slide = await this.prisma.slide.findUnique({
      where: { id: id },
    });
    
    if (!slide) {
      throw new NotFoundException('Slide no encontrado');
    }

    return slide;
  }

  @Post()
  async create(@Body() data: any) {
    return await this.prisma.slide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        image: data.image,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    const slide = await this.prisma.slide.findUnique({
      where: { id: id },
    });
    
    if (!slide) {
      throw new NotFoundException('Slide no encontrado');
    }

    return await this.prisma.slide.update({
      where: { id: id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        image: data.image,
        order: data.order,
        isActive: data.isActive,
      },
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const slide = await this.prisma.slide.findUnique({
      where: { id: id },
    });
    
    if (!slide) {
      throw new NotFoundException('Slide no encontrado');
    }

    return await this.prisma.slide.delete({
      where: { id: id },
    });
  }
}
