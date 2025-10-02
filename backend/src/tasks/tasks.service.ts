import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskOrderDto } from './dto/update-task-order.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    // Obtener el siguiente orden en la columna
    const lastTask = await this.prisma.task.findFirst({
      where: { status: createTaskDto.status },
      orderBy: { order: 'desc' },
    });

    const nextOrder = lastTask ? lastTask.order + 1 : 0;

    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        assignedTo: createTaskDto.assignedTo,
        clientId: createTaskDto.clientId,
        inquiryId: createTaskDto.inquiryId,
        tags: createTaskDto.tags || [],
        order: nextOrder,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      orderBy: [
        { status: 'asc' },
        { order: 'asc' },
      ],
    });
  }

  async findByStatus(status: string) {
    return this.prisma.task.findMany({
      where: { status },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const updateData: any = {};
    
    if (updateTaskDto.title !== undefined) updateData.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined) updateData.description = updateTaskDto.description;
    if (updateTaskDto.status !== undefined) updateData.status = updateTaskDto.status;
    if (updateTaskDto.priority !== undefined) updateData.priority = updateTaskDto.priority;
    if (updateTaskDto.dueDate !== undefined) updateData.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null;
    if (updateTaskDto.assignedTo !== undefined) updateData.assignedTo = updateTaskDto.assignedTo;
    if (updateTaskDto.clientId !== undefined) updateData.clientId = updateTaskDto.clientId;
    if (updateTaskDto.inquiryId !== undefined) updateData.inquiryId = updateTaskDto.inquiryId;
    if (updateTaskDto.tags !== undefined) updateData.tags = updateTaskDto.tags;

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async updateOrder(updateTaskOrderDto: UpdateTaskOrderDto) {
    const { taskId, newStatus, newOrder } = updateTaskOrderDto;

    // Actualizar la tarea específica
    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        order: newOrder,
      },
    });

    // Reordenar las tareas en la columna de destino
    const tasksInColumn = await this.prisma.task.findMany({
      where: { status: newStatus },
      orderBy: { order: 'asc' },
    });

    // Actualizar el orden de todas las tareas en la columna
    for (let i = 0; i < tasksInColumn.length; i++) {
      if (tasksInColumn[i].id !== taskId) {
        await this.prisma.task.update({
          where: { id: tasksInColumn[i].id },
          data: { order: i >= newOrder ? i + 1 : i },
        });
      }
    }

    return this.findAll();
  }

  async remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async getTasksByClient(clientId: string) {
    return this.prisma.task.findMany({
      where: { clientId },
      orderBy: [
        { status: 'asc' },
        { order: 'asc' },
      ],
    });
  }

  async getTasksByInquiry(inquiryId: string) {
    return this.prisma.task.findMany({
      where: { inquiryId },
      orderBy: [
        { status: 'asc' },
        { order: 'asc' },
      ],
    });
  }
}
