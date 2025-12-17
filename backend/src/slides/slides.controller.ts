import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Controller('slides')
export class SlidesController {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {}
  
  @Get()
  async findAll() {
    const cacheKey = 'slides:all:active';
    const cached = this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      console.log('🔍 Fetching slides...');
      const slides = await this.prisma.slide.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });
      console.log('📊 Slides found:', slides.length);
      
      // Cache for 15 minutes
      this.cacheService.set(cacheKey, slides, 15 * 60 * 1000);
      
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
    console.log('📝 Creating slide with data:', data);
    const slide = await this.prisma.slide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        buttonBackgroundColor: data.buttonBackgroundColor,
        buttonTextColor: data.buttonTextColor,
        buttonBorderColor: data.buttonBorderColor,
        buttonBorderWidth: data.buttonBorderWidth,
        buttonBorderRadius: data.buttonBorderRadius,
        buttonBoxShadow: data.buttonBoxShadow,
        titleColor: data.titleColor,
        titleSize: data.titleSize,
        titleShadow: data.titleShadow,
        image: data.image,
        mobileImage: data.mobileImage || null,
        videoUrl: data.videoUrl || null,
        mobileVideoUrl: data.mobileVideoUrl || null,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    // Clear cache after creating slide
    this.cacheService.delete('slides:all:active');
    
    return slide;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    console.log('✏️ Updating slide with data:', data);
    const slide = await this.prisma.slide.findUnique({
      where: { id: id },
    });
    
    if (!slide) {
      throw new NotFoundException('Slide no encontrado');
    }

    const updatedSlide = await this.prisma.slide.update({
      where: { id: id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        buttonBackgroundColor: data.buttonBackgroundColor,
        buttonTextColor: data.buttonTextColor,
        buttonBorderColor: data.buttonBorderColor,
        buttonBorderWidth: data.buttonBorderWidth,
        buttonBorderRadius: data.buttonBorderRadius,
        buttonBoxShadow: data.buttonBoxShadow,
        titleColor: data.titleColor,
        titleSize: data.titleSize,
        titleShadow: data.titleShadow,
        image: data.image,
        mobileImage: data.mobileImage !== undefined ? data.mobileImage : undefined,
        videoUrl: data.videoUrl !== undefined ? data.videoUrl : undefined,
        mobileVideoUrl: data.mobileVideoUrl !== undefined ? data.mobileVideoUrl : undefined,
        order: data.order,
        isActive: data.isActive,
      },
    });

    // Clear cache after updating slide
    this.cacheService.delete('slides:all:active');

    return updatedSlide;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const slide = await this.prisma.slide.findUnique({
      where: { id: id },
    });
    
    if (!slide) {
      throw new NotFoundException('Slide no encontrado');
    }

    const deletedSlide = await this.prisma.slide.delete({
      where: { id: id },
    });

    // Clear cache after deleting slide
    this.cacheService.delete('slides:all:active');

    return deletedSlide;
  }
}
