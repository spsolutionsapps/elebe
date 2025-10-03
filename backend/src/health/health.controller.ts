import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {}

  @Get()
  async check() {
    const startTime = Date.now();
    
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        responseTime: `${responseTime}ms`,
        cache: {
          size: this.cacheService.getStats().size,
          keys: this.cacheService.getStats().keys.length
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message
      };
    }
  }

  @Get('cache')
  getCacheStats() {
    const stats = this.cacheService.getStats();
    return {
      size: stats.size,
      keys: stats.keys,
      timestamp: new Date().toISOString()
    };
  }

  @Get('cache/clear')
  clearCache() {
    const beforeSize = this.cacheService.getStats().size;
    this.cacheService.clear();
    const afterSize = this.cacheService.getStats().size;
    
    return {
      message: 'Cache cleared successfully',
      beforeSize,
      afterSize,
      timestamp: new Date().toISOString()
    };
  }

  @Get('cache/clean')
  cleanExpired() {
    const beforeSize = this.cacheService.getStats().size;
    const cleaned = this.cacheService.cleanExpired();
    const afterSize = this.cacheService.getStats().size;
    
    return {
      message: 'Expired cache entries cleaned',
      beforeSize,
      afterSize,
      cleaned,
      timestamp: new Date().toISOString()
    };
  }
}
