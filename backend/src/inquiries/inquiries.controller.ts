import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Controller('inquiries')
export class InquiriesController {
  constructor(private prisma: PrismaService) {}

  // Función para generar tags automáticos
  private generateTags(inquiryData: CreateInquiryDto): string[] {
    const tags: string[] = [];
    
    // Tags basados en productos
    if (inquiryData.products && inquiryData.products.length > 0) {
      tags.push('con-productos');
      
      // Tag especial si hay productos con cantidad alta
      const hasHighQuantity = inquiryData.products.some(p => p.quantity > 5);
      if (hasHighQuantity) {
        tags.push('cantidad-alta');
      }
    }
    
    // Tags basados en mensaje
    if (inquiryData.message) {
      const messageLower = inquiryData.message.toLowerCase();
      
      if (messageLower.includes('vestido')) tags.push('vestido');
      if (messageLower.includes('blazer')) tags.push('blazer');
      if (messageLower.includes('camisa')) tags.push('camisa');
      if (messageLower.includes('pantalón')) tags.push('pantalon');
      if (messageLower.includes('falda')) tags.push('falda');
      
      if (messageLower.includes('talla')) tags.push('consulta-talla');
      if (messageLower.includes('precio')) tags.push('consulta-precio');
      if (messageLower.includes('envío')) tags.push('consulta-envio');
    }
    
    // Tags basados en contacto
    if (inquiryData.phone) tags.push('con-telefono');
    if (inquiryData.message && inquiryData.message.length > 100) tags.push('mensaje-detallado');
    
    return tags;
  }

  // Función para validar email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  @Get('test')
  async test() {
    return { message: 'Inquiries controller is working - Docker Test', timestamp: new Date() };
  }

  @Get()
  async findAll() {
    try {
      console.log('Fetching inquiries...');
      const inquiries = await this.prisma.inquiry.findMany({
        include: {
          products: {
            include: {
              product: true,
            },
          },
          followUpHistory: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log('Inquiries fetched successfully:', inquiries.length);
      return inquiries;
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id: id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        followUpHistory: true,
      },
    });
    
    if (!inquiry) {
      throw new NotFoundException('Consulta no encontrada');
    }
    return inquiry;
  }

  @Post()
  async create(@Body() createInquiryDto: CreateInquiryDto) {
    try {
      console.log('Datos recibidos:', createInquiryDto);
      
      // Generar tags automáticos
      const tags = this.generateTags(createInquiryDto);
      
      console.log('Tags generados:', tags);
      
      // Crear la consulta
      const inquiry = await this.prisma.inquiry.create({
        data: {
          name: createInquiryDto.name,
          email: createInquiryDto.email,
          phone: createInquiryDto.phone || null,
          message: createInquiryDto.message || null,
          status: 'new',
          priority: 'medium',
          source: 'website',
          tags: tags,
          estimatedValue: 100.0,
        },
      });

      console.log('Nueva consulta creada:', inquiry);

      // Procesar productos si existen
      if (createInquiryDto.products && createInquiryDto.products.length > 0) {
        console.log('Procesando productos:', createInquiryDto.products);
        console.log('Cantidad de productos recibidos:', createInquiryDto.products.length);
        
        for (const productData of createInquiryDto.products) {
          // Buscar el producto por nombre
          const product = await this.prisma.product.findFirst({
            where: {
              name: {
                contains: productData.name,
                mode: 'insensitive'
              }
            }
          });

          if (product) {
            // Crear la relación InquiryProduct con la cantidad real
            await this.prisma.inquiryProduct.create({
              data: {
                inquiryId: inquiry.id,
                productId: product.id,
                quantity: productData.quantity,
              }
            });
            console.log(`Producto "${productData.name}" (${productData.quantity} unidades) vinculado a la consulta`);
          } else {
            console.log(`Producto "${productData.name}" no encontrado en la base de datos`);
          }
        }
      }

      return {
        message: 'Consulta enviada correctamente',
        inquiry: {
          id: inquiry.id,
          status: inquiry.status,
          priority: inquiry.priority,
        },
      };
    } catch (error) {
      console.error('Error creando consulta:', error);
      throw new Error('Error al crear la consulta');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateInquiryDto: any) {
    // Validar que el estado sea válido
    const validStatuses = ['new', 'hot', 'warm', 'cold', 'contacted', 'closed', 'lost'];
    if (updateInquiryDto.status && !validStatuses.includes(updateInquiryDto.status)) {
      throw new NotFoundException('Estado de consulta inválido');
    }

    // Si se actualiza el status a 'contacted', actualizar lastContactDate
    const updateData: any = {
      ...updateInquiryDto,
      updatedAt: new Date(),
    };

    if (updateInquiryDto.status === 'contacted') {
      updateData.lastContactDate = new Date();
    }

    const inquiry = await this.prisma.inquiry.update({
      where: { id: id },
      data: updateData,
      include: {
        products: {
          include: {
            product: true,
          },
        },
        followUpHistory: true,
      },
    });

    console.log('Consulta actualizada:', inquiry);
    return {
      message: 'Consulta actualizada correctamente',
      inquiry,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      // Verificar que la consulta existe
      const inquiry = await this.prisma.inquiry.findUnique({
        where: { id: id },
      });

      if (!inquiry) {
        throw new NotFoundException('Consulta no encontrada');
      }

      // Eliminar la consulta
      await this.prisma.inquiry.delete({
        where: { id: id },
      });

      console.log('Consulta eliminada:', id);

      return {
        message: 'Consulta eliminada correctamente',
      };
    } catch (error) {
      console.error('Error eliminando consulta:', error);
      throw new Error('Error al eliminar la consulta');
    }
  }

  // Endpoint para agregar seguimiento a un lead
  @Post(':id/follow-up')
  async addFollowUp(@Param('id') id: string, @Body() followUpData: any) {
    try {
      const inquiry = await this.prisma.inquiry.findUnique({
        where: { id: id },
      });

      if (!inquiry) {
        throw new NotFoundException('Consulta no encontrada');
      }

      const followUp = await this.prisma.followUpHistory.create({
        data: {
          inquiryId: id,
          type: followUpData.type, // call, email, whatsapp, meeting, note
          description: followUpData.description,
          outcome: followUpData.outcome, // positive, negative, neutral, scheduled
          nextAction: followUpData.nextAction,
        },
      });

      // Actualizar la consulta con la fecha de último contacto
      const updateData: any = {
        lastContactDate: new Date(),
        status: followUpData.outcome === 'positive' ? 'hot' : 
                followUpData.outcome === 'negative' ? 'cold' : 'warm',
      };

      // Si se proporciona una fecha de recordatorio, crear el recordatorio
      if (followUpData.reminderDate && followUpData.reminderTime) {
        const reminder = await this.prisma.reminder.create({
          data: {
            title: `Contactar a ${inquiry.name}`,
            description: followUpData.nextAction || `Seguimiento programado desde consulta`,
            date: new Date(followUpData.reminderDate),
            time: followUpData.reminderTime,
            type: 'follow_up',
            priority: 'medium',
            clientName: inquiry.name,
            alertMinutes: 15,
          },
        });

        // Actualizar la consulta con la fecha del próximo seguimiento
        updateData.nextFollowUpDate = new Date(followUpData.reminderDate + ' ' + followUpData.reminderTime);
        updateData.followUpNotes = followUpData.nextAction;

        console.log('Recordatorio creado:', reminder);
      }

      await this.prisma.inquiry.update({
        where: { id: id },
        data: updateData,
      });

      return {
        message: 'Seguimiento agregado correctamente',
        followUp,
        reminderCreated: !!(followUpData.reminderDate && followUpData.reminderTime),
      };
    } catch (error) {
      console.error('Error agregando seguimiento:', error);
      throw new Error('Error al agregar seguimiento');
    }
  }

  // Endpoint para obtener leads por prioridad
  @Get('priority/:priority')
  async findByPriority(@Param('priority') priority: string) {
    return await this.prisma.inquiry.findMany({
      where: { priority: priority },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        followUpHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Endpoint para obtener leads por status
  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    return await this.prisma.inquiry.findMany({
      where: { status: status },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        followUpHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Endpoint para obtener leads que necesitan seguimiento
  @Get('follow-up/due')
  async getLeadsDueForFollowUp() {
    const now = new Date();
    return await this.prisma.inquiry.findMany({
      where: {
        nextFollowUpDate: {
          lte: now,
        },
        status: {
          not: 'closed',
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        followUpHistory: true,
      },
      orderBy: {
        nextFollowUpDate: 'asc',
      },
    });
  }

  // Endpoint para convertir un contacto en cliente
  @Post(':id/convert-to-client')
  async convertToClient(@Param('id') id: string, @Body() clientData: any) {
    try {
      // Verificar que la consulta existe
      const inquiry = await this.prisma.inquiry.findUnique({
        where: { id: id },
      });

      if (!inquiry) {
        throw new NotFoundException('Consulta no encontrada');
      }

      if (inquiry.isConvertedToClient) {
        throw new Error('Este contacto ya fue convertido a cliente');
      }

      // Crear el cliente
      const client = await this.prisma.client.create({
        data: {
          name: clientData.name || inquiry.name,
          email: clientData.email || inquiry.email,
          phone: clientData.phone || inquiry.phone,
          address: clientData.address || null,
          city: clientData.city || null,
          country: clientData.country || null,
          notes: clientData.notes || `Convertido desde consulta: ${inquiry.message || 'Sin mensaje'}`,
        },
      });

      // Actualizar la consulta para marcar que fue convertida
      await this.prisma.inquiry.update({
        where: { id: id },
        data: {
          isConvertedToClient: true,
          clientId: client.id,
          status: 'closed',
        },
      });

      console.log('Contacto convertido a cliente:', client);

      return {
        message: 'Contacto convertido a cliente correctamente',
        client: client,
        inquiry: {
          id: inquiry.id,
          isConvertedToClient: true,
          clientId: client.id,
        },
      };
    } catch (error) {
      console.error('Error convirtiendo contacto a cliente:', error);
      throw new Error('Error al convertir contacto a cliente');
    }
  }
}
