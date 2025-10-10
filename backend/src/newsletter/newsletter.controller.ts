import { Controller, Get, Post, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {}
  
  @Get()
  async findAll() {
    const cacheKey = 'newsletter:all';
    const cached = this.cacheService.get(cacheKey);
    
    if (cached) {
      console.log('📦 Returning cached newsletter subscribers');
      return cached;
    }

    try {
      console.log('🔍 Fetching newsletter subscribers from database...');
      // Devolver todos los suscriptores (activos e inactivos) para el admin
      const subscribers = await this.prisma.newsletter.findMany({
        orderBy: { createdAt: 'desc' },
      });
      console.log('📊 Subscribers found:', subscribers.length);
      console.log('📊 Active:', subscribers.filter(s => s.isActive).length);
      console.log('📊 Inactive:', subscribers.filter(s => !s.isActive).length);
      
      // Cache for 5 minutes
      this.cacheService.set(cacheKey, subscribers, 5 * 60 * 1000);
      
      return subscribers;
    } catch (error) {
      console.error('❌ Error fetching newsletter subscribers:', error);
      throw error;
    }
  }

  @Get('stats')
  async getStats() {
    const cacheKey = 'newsletter:stats';
    const cached = this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const total = await this.prisma.newsletter.count();
      const active = await this.prisma.newsletter.count({
        where: { isActive: true }
      });
      const inactive = await this.prisma.newsletter.count({
        where: { isActive: false }
      });

      // Get subscribers from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recent = await this.prisma.newsletter.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      });

      const stats = {
        total,
        active,
        inactive,
        recent
      };
      
      // Cache for 5 minutes
      this.cacheService.set(cacheKey, stats, 5 * 60 * 1000);
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting newsletter stats:', error);
      throw error;
    }
  }

  @Post()
  async subscribe(@Body() data: { email: string }) {
    try {
      if (!data.email) {
        throw new BadRequestException('El email es requerido');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new BadRequestException('El formato del email no es válido');
      }

      console.log('📧 Subscribing email:', data.email);

      // Verificar si el email ya existe
      const existing = await this.prisma.newsletter.findUnique({
        where: { email: data.email.toLowerCase().trim() }
      });

      if (existing) {
        // Si ya existe pero está inactivo, reactivarlo
        if (!existing.isActive) {
          const updated = await this.prisma.newsletter.update({
            where: { id: existing.id },
            data: { isActive: true, updatedAt: new Date() }
          });
          
          // Clear cache
          this.cacheService.delete('newsletter:all');
          this.cacheService.delete('newsletter:stats');
          
          console.log('✅ Reactivated subscription:', updated.email);
          return { message: 'Te has suscrito correctamente', subscriber: updated };
        }
        
        console.log('⚠️ Email already subscribed:', data.email);
        return { message: 'Este email ya está suscrito', subscriber: existing };
      }

      // Crear nueva suscripción
      const subscriber = await this.prisma.newsletter.create({
        data: {
          email: data.email.toLowerCase().trim(),
          isActive: true,
        },
      });

      // Clear cache
      this.cacheService.delete('newsletter:all');
      this.cacheService.delete('newsletter:stats');
      
      console.log('✅ New subscription created:', subscriber.email);
      return { message: 'Te has suscrito correctamente', subscriber };
    } catch (error) {
      console.error('❌ Error subscribing to newsletter:', error);
      throw error;
    }
  }

  @Delete(':id')
  async unsubscribe(@Param('id') id: string) {
    try {
      const subscriber = await this.prisma.newsletter.findUnique({
        where: { id }
      });
      
      if (!subscriber) {
        throw new BadRequestException('Suscriptor no encontrado');
      }

      // Hard delete - eliminar completamente el registro
      const deleted = await this.prisma.newsletter.delete({
        where: { id }
      });

      // Clear cache
      this.cacheService.delete('newsletter:all');
      this.cacheService.delete('newsletter:stats');

      console.log('✅ Deleted subscriber:', deleted.email);
      return { message: 'Suscriptor eliminado correctamente', subscriber: deleted };
    } catch (error) {
      console.error('❌ Error deleting subscriber:', error);
      throw error;
    }
  }

  @Post(':id/toggle')
  async toggleActive(@Param('id') id: string) {
    try {
      const subscriber = await this.prisma.newsletter.findUnique({
        where: { id }
      });
      
      if (!subscriber) {
        throw new BadRequestException('Suscriptor no encontrado');
      }

      const updated = await this.prisma.newsletter.update({
        where: { id },
        data: { isActive: !subscriber.isActive }
      });

      // Clear cache
      this.cacheService.delete('newsletter:all');
      this.cacheService.delete('newsletter:stats');

      return updated;
    } catch (error) {
      console.error('❌ Error toggling subscriber status:', error);
      throw error;
    }
  }
}

