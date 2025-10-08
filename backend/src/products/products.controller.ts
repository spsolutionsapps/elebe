import { Controller, Get, Post, Put, Delete, Patch, Param, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Controller('products')
export class ProductsController {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {}
  
  @Get()
  async findAll() {
    const cacheKey = 'products:all';
    const cached = this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Cache for 10 minutes
    this.cacheService.set(cacheKey, products, 10 * 60 * 1000);
    
    return products;
  }

  @Get('featured')
  async findFeatured() {
    const cacheKey = 'products:featured';
    const cached = this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const featuredProducts = await this.prisma.product.findMany({
      where: { 
        isActive: true,
        isFeatured: true
      },
      orderBy: { featuredOrder: 'asc' },
    });
    
    console.log('Productos destacados encontrados:', featuredProducts.length);
    
    // Cache for 15 minutes
    this.cacheService.set(cacheKey, featuredProducts, 15 * 60 * 1000);
    
    return featuredProducts;
  }

  @Get('popular')
  async findPopular() {
    const cacheKey = 'products:popular';
    const cached = this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const popularProducts = await this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { views: 'desc' },
      take: 10,
    });
    
    console.log('Productos populares encontrados:', popularProducts.length);
    
    // Cache for 5 minutes (popular products change more frequently)
    this.cacheService.set(cacheKey, popularProducts, 5 * 60 * 1000);
    
    return popularProducts;
  }

  // Endpoint de debug para verificar productos
  @Get('debug/all')
  async debugAll() {
    const allProducts = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log('=== DEBUG: TODOS LOS PRODUCTOS ===');
    console.log('Total productos:', allProducts.length);
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id}, Nombre: ${product.name}, Activo: ${product.isActive}`);
    });
    return allProducts;
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    console.log('🔍 Buscando producto con slug:', slug);
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    // Buscar todos los productos activos
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
    });
    
    // Función para generar slug
    const generateSlug = (text: string): string => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-') // Remover guiones múltiples
        .trim()
    }
    
    // Buscar producto que coincida con el slug
    const product = products.find(p => generateSlug(p.name) === slug);
    
    console.log('Producto encontrado por slug:', product);
    
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Incrementar contador de visitas
    console.log('📈 Incrementando vistas para producto:', product.name, 'ID:', product.id);
    
    // Verificar si ya se incrementó recientemente usando el cache (últimos 30 segundos)
    const viewCacheKey = `product:view:${product.id}`;
    const recentView = this.cacheService.get(viewCacheKey);
    
    if (!recentView) {
      // Incrementar vistas en la base de datos
      await this.prisma.product.update({
        where: { id: product.id },
        data: { views: { increment: 1 } }
      });
      
      // Marcar en cache que este producto fue visto recientemente (30 segundos)
      this.cacheService.set(viewCacheKey, true, 30 * 1000);
      
      // Invalidar cache de productos populares ya que las vistas cambiaron
      this.cacheService.delete('products:popular');
      
      console.log('✅ Vistas incrementadas');
    } else {
      console.log('⏭️ Incremento omitido (vista reciente en cache)');
    }

    // Obtener el producto actualizado con las nuevas vistas
    const updatedProduct = await this.prisma.product.findUnique({
      where: { id: product.id }
    });

    console.log('📊 Vistas finales:', updatedProduct?.views);
    return updatedProduct;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('Buscando producto con ID:', id);
    
    // Obtener el producto
    const product = await this.prisma.product.findUnique({
      where: { id: id }
    });
    
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    
    // Incrementar contador de visitas
    console.log('📈 Incrementando vistas para producto ID:', id);
    
    // Verificar si ya se incrementó recientemente usando el cache (últimos 30 segundos)
    const viewCacheKey = `product:view:${id}`;
    const recentView = this.cacheService.get(viewCacheKey);
    
    if (!recentView) {
      // Incrementar vistas en la base de datos
      await this.prisma.product.update({
        where: { id: id },
        data: { views: { increment: 1 } }
      });
      
      // Marcar en cache que este producto fue visto recientemente (30 segundos)
      this.cacheService.set(viewCacheKey, true, 30 * 1000);
      
      // Invalidar cache de productos populares ya que las vistas cambiaron
      this.cacheService.delete('products:popular');
      
      console.log('✅ Vistas incrementadas (por ID)');
      
      // Obtener el producto actualizado
      const updatedProduct = await this.prisma.product.findUnique({
        where: { id: id }
      });
      
      console.log('📊 Vistas finales:', updatedProduct?.views);
      return updatedProduct;
    } else {
      console.log('⏭️ Incremento omitido (vista reciente en cache)');
      return product;
    }
  }

  @Post()
  async create(@Body() createProductDto: any) {
    try {
      console.log('🚀 Backend: POST /api/products - Iniciando creación de producto');
      console.log('📝 Backend: Datos recibidos:', JSON.stringify(createProductDto, null, 2));
      
      // Validar datos básicos
      if (!createProductDto.name) {
        console.log('❌ Backend: Error - nombre es requerido');
        throw new Error('El nombre es requerido');
      }
      
      console.log('✅ Backend: Validación básica pasada');
      
      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          category: createProductDto.category || 'General',
          image: createProductDto.image || null,
          images: createProductDto.images || [],
          price: createProductDto.price ? parseFloat(createProductDto.price) : null,
          isActive: true,
          // Especificaciones técnicas
          printingTypes: createProductDto.printingTypes || [],
          productHeight: createProductDto.productHeight ? parseFloat(createProductDto.productHeight) : null,
          productLength: createProductDto.productLength ? parseFloat(createProductDto.productLength) : null,
          productWidth: createProductDto.productWidth ? parseFloat(createProductDto.productWidth) : null,
          productWeight: createProductDto.productWeight ? parseFloat(createProductDto.productWeight) : null,
          packagingHeight: createProductDto.packagingHeight ? parseFloat(createProductDto.packagingHeight) : null,
          packagingLength: createProductDto.packagingLength ? parseFloat(createProductDto.packagingLength) : null,
          packagingWidth: createProductDto.packagingWidth ? parseFloat(createProductDto.packagingWidth) : null,
          packagingWeight: createProductDto.packagingWeight ? parseFloat(createProductDto.packagingWeight) : null,
          unitsPerBox: createProductDto.unitsPerBox ? parseInt(createProductDto.unitsPerBox) : null,
          individualPackaging: createProductDto.individualPackaging || null,
        },
      });

      console.log('✅ Backend: Producto creado exitosamente:', product);
      
      // Invalidate cache
      console.log('🗑️ Backend: Invalidando cache...');
      this.cacheService.delete('products:all');
      this.cacheService.delete('products:featured');
      this.cacheService.delete('products:popular');
      console.log('✅ Backend: Cache invalidado');
      
      const response = {
        message: 'Producto creado correctamente',
        product,
      };
      
      console.log('📤 Backend: Enviando respuesta:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('❌ Backend: Error creando producto:', error);
      console.error('❌ Backend: Stack trace:', error.stack);
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    try {
      console.log('🚀 Backend: PUT /api/products/' + id + ' - Iniciando actualización de producto');
      console.log('🆔 Backend: ID recibido:', id);
      console.log('📝 Backend: Datos recibidos:', JSON.stringify(updateProductDto, null, 2));
      
      // Verificar que el producto existe
      const existingProduct = await this.prisma.product.findUnique({
        where: { id: id },
      });

      console.log('🔍 Backend: Producto encontrado en BD:', existingProduct);

      if (!existingProduct) {
        console.log('❌ Backend: Error - Producto no encontrado con ID:', id);
        throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
      }

      console.log('✅ Backend: Validación de producto existente pasada');

      const product = await this.prisma.product.update({
        where: { id: id },
        data: {
          name: updateProductDto.name,
          description: updateProductDto.description,
          category: updateProductDto.category || 'General',
          image: updateProductDto.image || null,
          images: updateProductDto.images || [],
          price: updateProductDto.price ? parseFloat(updateProductDto.price) : null,
          isActive: updateProductDto.isActive,
          updatedAt: new Date(),
          // Especificaciones técnicas
          printingTypes: updateProductDto.printingTypes || [],
          productHeight: updateProductDto.productHeight ? parseFloat(updateProductDto.productHeight) : null,
          productLength: updateProductDto.productLength ? parseFloat(updateProductDto.productLength) : null,
          productWidth: updateProductDto.productWidth ? parseFloat(updateProductDto.productWidth) : null,
          productWeight: updateProductDto.productWeight ? parseFloat(updateProductDto.productWeight) : null,
          packagingHeight: updateProductDto.packagingHeight ? parseFloat(updateProductDto.packagingHeight) : null,
          packagingLength: updateProductDto.packagingLength ? parseFloat(updateProductDto.packagingLength) : null,
          packagingWidth: updateProductDto.packagingWidth ? parseFloat(updateProductDto.packagingWidth) : null,
          packagingWeight: updateProductDto.packagingWeight ? parseFloat(updateProductDto.packagingWeight) : null,
          unitsPerBox: updateProductDto.unitsPerBox ? parseInt(updateProductDto.unitsPerBox) : null,
          individualPackaging: updateProductDto.individualPackaging || null,
        },
      });

      console.log('✅ Backend: Producto actualizado exitosamente:', product);
      
      // Invalidate cache
      console.log('🗑️ Backend: Invalidando cache...');
      this.cacheService.delete('products:all');
      this.cacheService.delete('products:featured');
      this.cacheService.delete('products:popular');
      this.cacheService.delete(`products:${id}`);
      console.log('✅ Backend: Cache invalidado');
      
      const response = {
        message: 'Producto actualizado correctamente',
        product,
      };
      
      console.log('📤 Backend: Enviando respuesta:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('❌ Backend: Error actualizando producto:', error);
      console.error('❌ Backend: Stack trace:', error.stack);
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      // Verificar que el producto existe
      const existingProduct = await this.prisma.product.findUnique({
        where: { id: id },
      });

      if (!existingProduct) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Eliminar el producto realmente
      await this.prisma.product.delete({
        where: { id: id },
      });

      console.log('Producto eliminado:', id);
      
      // Invalidate cache
      this.cacheService.delete('products:all');
      this.cacheService.delete('products:featured');
      this.cacheService.delete('products:popular');
      this.cacheService.delete(`products:${id}`);
      
      return {
        message: 'Producto eliminado correctamente',
      };
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw new Error('Error al eliminar el producto');
    }
  }

  // Endpoints para productos destacados
  @Post(':id/feature')
  async addToFeatured(@Param('id') id: string) {
    try {
      // Verificar que el producto existe
      const existingProduct = await this.prisma.product.findUnique({
        where: { id: id },
      });

      if (!existingProduct) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Contar productos destacados actuales
      const featuredCount = await this.prisma.product.count({
        where: { isFeatured: true },
      });

      if (featuredCount > 8) {
        throw new Error('Ya tienes 8 productos destacados. Remueve uno para agregar otro.');
      }

      // Agregar a destacados
      const updatedProduct = await this.prisma.product.update({
        where: { id: id },
        data: { 
          isFeatured: true,
          featuredOrder: featuredCount + 1
        },
      });

      console.log('Producto agregado a destacados:', updatedProduct.name);
      
      // Invalidate cache
      console.log('🗑️ Backend: Invalidando cache después de agregar a destacados...');
      this.cacheService.delete('products:all');
      this.cacheService.delete('products:featured');
      this.cacheService.delete('products:popular');
      console.log('✅ Backend: Cache invalidado');
      
      return {
        message: 'Producto agregado a destacados correctamente',
        product: updatedProduct,
      };
    } catch (error) {
      console.error('Error agregando producto a destacados:', error);
      throw new Error(error.message || 'Error al agregar producto a destacados');
    }
  }

  @Delete(':id/unfeature')
  async removeFromFeatured(@Param('id') id: string) {
    try {
      // Verificar que el producto existe
      const existingProduct = await this.prisma.product.findUnique({
        where: { id: id },
      });

      if (!existingProduct) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Remover de destacados
      const updatedProduct = await this.prisma.product.update({
        where: { id: id },
        data: { 
          isFeatured: false,
          featuredOrder: null
        },
      });

      // Reordenar los productos destacados restantes
      await this.reorderFeaturedProducts();

      console.log('Producto removido de destacados:', updatedProduct.name);
      
      // Invalidate cache
      console.log('🗑️ Backend: Invalidando cache después de remover de destacados...');
      this.cacheService.delete('products:all');
      this.cacheService.delete('products:featured');
      this.cacheService.delete('products:popular');
      console.log('✅ Backend: Cache invalidado');
      
      return {
        message: 'Producto removido de destacados correctamente',
        product: updatedProduct,
      };
    } catch (error) {
      console.error('Error removiendo producto de destacados:', error);
      throw new Error('Error al remover producto de destacados');
    }
  }

  @Patch(':id/feature-order')
  async updateFeaturedOrder(@Param('id') id: string, @Body() body: { order: number }) {
    try {
      // Verificar que el producto existe
      const existingProduct = await this.prisma.product.findUnique({
        where: { id: id },
      });

      if (!existingProduct) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Actualizar el orden
      const updatedProduct = await this.prisma.product.update({
        where: { id: id },
        data: { featuredOrder: body.order },
      });

      console.log('Orden de producto destacado actualizado:', updatedProduct.name, 'orden:', body.order);
      return {
        message: 'Orden actualizado correctamente',
        product: updatedProduct,
      };
    } catch (error) {
      console.error('Error actualizando orden:', error);
      throw new Error('Error al actualizar el orden');
    }
  }

  @Patch('update-featured-order')
  async updateFeaturedOrderBulk(@Body() body: { featuredProducts: { id: string; order: number }[] }) {
    try {
      const { featuredProducts } = body;
      
      // Actualizar el orden de todos los productos destacados
      for (const item of featuredProducts) {
        await this.prisma.product.update({
          where: { id: item.id },
          data: { featuredOrder: item.order },
        });
      }

      console.log('Orden de productos destacados actualizado en lote');
      
      // Invalidate cache
      console.log('🗑️ Backend: Invalidando cache después de actualizar orden...');
      this.cacheService.delete('products:all');
      this.cacheService.delete('products:featured');
      this.cacheService.delete('products:popular');
      console.log('✅ Backend: Cache invalidado');
      
      return {
        message: 'Orden de productos destacados actualizado correctamente',
      };
    } catch (error) {
      console.error('Error actualizando orden en lote:', error);
      throw new Error('Error al actualizar el orden de productos destacados');
    }
  }

  // Método privado para reordenar productos destacados
  private async reorderFeaturedProducts() {
    const featuredProducts = await this.prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { featuredOrder: 'asc' },
    });

    // Reasignar órdenes secuenciales
    for (let i = 0; i < featuredProducts.length; i++) {
      await this.prisma.product.update({
        where: { id: featuredProducts[i].id },
        data: { featuredOrder: i + 1 },
      });
    }
  }
}
