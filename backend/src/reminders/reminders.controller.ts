import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reminders')
export class RemindersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return await this.prisma.reminder.findMany({
      where: { isCompleted: false },
      orderBy: { date: 'asc' },
    });
  }

  @Get('upcoming')
  async findUpcoming() {
    const now = new Date();
    return await this.prisma.reminder.findMany({
      where: {
        isCompleted: false,
        date: {
          gte: now,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  @Get('today')
  async findToday() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return await this.prisma.reminder.findMany({
      where: {
        isCompleted: false,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: { time: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const reminder = await this.prisma.reminder.findUnique({
      where: { id: id },
    });
    
    if (!reminder) {
      throw new NotFoundException('Recordatorio no encontrado');
    }
    return reminder;
  }

  @Post()
  async create(@Body() createReminderDto: any) {
    try {
      const reminder = await this.prisma.reminder.create({
        data: {
          title: createReminderDto.title,
          description: createReminderDto.description || null,
          date: new Date(createReminderDto.date),
          time: createReminderDto.time,
          type: createReminderDto.type || 'general',
          priority: createReminderDto.priority || 'medium',
          isCompleted: false,
          clientId: createReminderDto.clientId || null,
          clientName: createReminderDto.clientName || null,
          alertMinutes: createReminderDto.alertMinutes || 15,
        },
      });

      console.log('Nuevo recordatorio creado:', reminder);

      return {
        message: 'Recordatorio creado correctamente',
        reminder: {
          id: reminder.id,
          title: reminder.title,
          date: reminder.date,
          time: reminder.time,
        },
      };
    } catch (error) {
      console.error('Error creando recordatorio:', error);
      throw new Error('Error al crear el recordatorio');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateReminderDto: any) {
    try {
      const reminder = await this.prisma.reminder.update({
        where: { id: id },
        data: {
          ...updateReminderDto,
          updatedAt: new Date(),
        },
      });

      console.log('Recordatorio actualizado:', reminder);

      return {
        message: 'Recordatorio actualizado correctamente',
        reminder,
      };
    } catch (error) {
      console.error('Error actualizando recordatorio:', error);
      throw new Error('Error al actualizar el recordatorio');
    }
  }

  @Put(':id/complete')
  async markAsCompleted(@Param('id') id: string) {
    try {
      const reminder = await this.prisma.reminder.update({
        where: { id: id },
        data: {
          isCompleted: true,
          updatedAt: new Date(),
        },
      });

      console.log('Recordatorio marcado como completado:', reminder);

      return {
        message: 'Recordatorio marcado como completado',
        reminder,
      };
    } catch (error) {
      console.error('Error marcando recordatorio como completado:', error);
      throw new Error('Error al marcar el recordatorio como completado');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.prisma.reminder.delete({
        where: { id: id },
      });

      console.log('Recordatorio eliminado');

      return {
        message: 'Recordatorio eliminado correctamente',
      };
    } catch (error) {
      console.error('Error eliminando recordatorio:', error);
      throw new Error('Error al eliminar el recordatorio');
    }
  }
}
