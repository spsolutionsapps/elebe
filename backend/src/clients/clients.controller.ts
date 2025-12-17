import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('clients')
export class ClientsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return await this.prisma.client.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: id },
    });
    
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return client;
  }

  @Post()
  async create(@Body() createClientDto: any) {
    try {
      const client = await this.prisma.client.create({
        data: {
          name: createClientDto.name,
          email: createClientDto.email || null,
          phone: createClientDto.phone,
          address: createClientDto.address || null,
          city: createClientDto.city || null,
          country: createClientDto.country || null,
          notes: createClientDto.notes || null,
          isActive: true,
        },
      });

      console.log('Nuevo cliente creado:', client);

      return {
        message: 'Cliente creado correctamente',
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
        },
      };
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw new Error('Error al crear el cliente');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateClientDto: any) {
    try {
      const client = await this.prisma.client.update({
        where: { id: id },
        data: {
          ...updateClientDto,
          updatedAt: new Date(),
        },
      });

      console.log('Cliente actualizado:', client);

      return {
        message: 'Cliente actualizado correctamente',
        client,
      };
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw new Error('Error al actualizar el cliente');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      // Soft delete - marcar como inactivo en lugar de eliminar
      const client = await this.prisma.client.update({
        where: { id: id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });

      console.log('Cliente marcado como inactivo:', client);

      return {
        message: 'Cliente eliminado correctamente',
      };
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw new Error('Error al eliminar el cliente');
    }
  }
}
