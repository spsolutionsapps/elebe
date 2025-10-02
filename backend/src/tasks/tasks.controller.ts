import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskOrderDto } from './dto/update-task-order.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiResponse({ status: 200, description: 'Lista de tareas obtenida exitosamente' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener tareas por estado' })
  @ApiResponse({ status: 200, description: 'Tareas filtradas por estado' })
  findByStatus(@Param('status') status: string) {
    return this.tasksService.findByStatus(status);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Obtener tareas por cliente' })
  @ApiResponse({ status: 200, description: 'Tareas del cliente' })
  getTasksByClient(@Param('clientId') clientId: string) {
    return this.tasksService.getTasksByClient(clientId);
  }

  @Get('inquiry/:inquiryId')
  @ApiOperation({ summary: 'Obtener tareas por consulta' })
  @ApiResponse({ status: 200, description: 'Tareas de la consulta' })
  getTasksByInquiry(@Param('inquiryId') inquiryId: string) {
    return this.tasksService.getTasksByInquiry(inquiryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch('order/update')
  @ApiOperation({ summary: 'Actualizar orden de tarea (drag & drop)' })
  @ApiResponse({ status: 200, description: 'Orden actualizado exitosamente' })
  updateOrder(@Body() updateTaskOrderDto: UpdateTaskOrderDto) {
    return this.tasksService.updateOrder(updateTaskOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada exitosamente' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
