import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task with correct order', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        dueDate: '2024-12-31',
        assignedTo: 'user1',
        clientId: 'client1',
        inquiryId: 'inquiry1',
        tags: ['urgent', 'important'],
      };

      const mockLastTask = { 
        id: 'last-task',
        title: 'Last Task',
        description: 'Last Description',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(),
        assignedTo: 'user1',
        clientId: 'client1',
        inquiryId: 'inquiry1',
        tags: [],
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockCreatedTask = {
        id: 'task1',
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        dueDate: new Date(createTaskDto.dueDate),
        assignedTo: createTaskDto.assignedTo,
        clientId: createTaskDto.clientId,
        inquiryId: createTaskDto.inquiryId,
        tags: createTaskDto.tags,
        order: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.task, 'findFirst').mockResolvedValue(mockLastTask as any);
      jest.spyOn(prismaService.task, 'create').mockResolvedValue(mockCreatedTask as any);

      const result = await service.create(createTaskDto);

      expect(prismaService.task.findFirst).toHaveBeenCalledWith({
        where: { status: createTaskDto.status },
        orderBy: { order: 'desc' },
      });
      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: createTaskDto.status,
          priority: createTaskDto.priority,
          dueDate: new Date(createTaskDto.dueDate),
          assignedTo: createTaskDto.assignedTo,
          clientId: createTaskDto.clientId,
          inquiryId: createTaskDto.inquiryId,
          tags: createTaskDto.tags,
          order: 6,
        },
      });
      expect(result).toEqual(mockCreatedTask);
    });

    it('should create a task with order 0 when no existing tasks', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'First Task',
        description: 'First Description',
        status: 'todo',
        priority: 'low',
      };

      const mockCreatedTask = {
        id: 'task1',
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        dueDate: null,
        assignedTo: null,
        clientId: null,
        inquiryId: null,
        tags: [],
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.task, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.task, 'create').mockResolvedValue(mockCreatedTask as any);

      const result = await service.create(createTaskDto);

      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          order: 0,
        }),
      });
      expect(result).toEqual(mockCreatedTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks ordered by status and order', async () => {
      const mockTasks = [
        { 
          id: 'task1', 
          title: 'Task 1',
          description: 'Description 1',
          status: 'todo', 
          priority: 'medium',
          dueDate: null,
          assignedTo: null,
          clientId: null,
          inquiryId: null,
          tags: [],
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { 
          id: 'task2', 
          title: 'Task 2',
          description: 'Description 2',
          status: 'in-progress', 
          priority: 'high',
          dueDate: null,
          assignedTo: null,
          clientId: null,
          inquiryId: null,
          tags: [],
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prismaService.task, 'findMany').mockResolvedValue(mockTasks as any);

      const result = await service.findAll();

      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        orderBy: [
          { status: 'asc' },
          { order: 'asc' },
        ],
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('findByStatus', () => {
    it('should return tasks filtered by status', async () => {
      const mockTasks = [
        { 
          id: 'task1', 
          title: 'Task 1',
          description: 'Description 1',
          status: 'todo', 
          priority: 'medium',
          dueDate: null,
          assignedTo: null,
          clientId: null,
          inquiryId: null,
          tags: [],
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prismaService.task, 'findMany').mockResolvedValue(mockTasks as any);

      const result = await service.findByStatus('todo');

      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { status: 'todo' },
        orderBy: { order: 'asc' },
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const mockTask = {
        id: 'task1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
        assignedTo: null,
        clientId: null,
        inquiryId: null,
        tags: [],
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.task, 'findUnique').mockResolvedValue(mockTask as any);

      const result = await service.findOne('task1');

      expect(prismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 'task1' },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task with provided data', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        status: 'in-progress',
      };

      const mockUpdatedTask = {
        id: 'task1',
        title: 'Updated Task',
        description: 'Original Description',
        status: 'in-progress',
        priority: 'medium',
        dueDate: null,
        assignedTo: null,
        clientId: null,
        inquiryId: null,
        tags: [],
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.task, 'update').mockResolvedValue(mockUpdatedTask as any);

      const result = await service.update('task1', updateTaskDto);

      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: 'task1' },
        data: {
          title: 'Updated Task',
          status: 'in-progress',
        },
      });
      expect(result).toEqual(mockUpdatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task by id', async () => {
      const mockDeletedTask = {
        id: 'task1',
        title: 'Deleted Task',
        description: 'Deleted Description',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
        assignedTo: null,
        clientId: null,
        inquiryId: null,
        tags: [],
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.task, 'delete').mockResolvedValue(mockDeletedTask as any);

      const result = await service.remove('task1');

      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: { id: 'task1' },
      });
      expect(result).toEqual(mockDeletedTask);
    });
  });

  describe('getTasksByClient', () => {
    it('should return tasks for a specific client', async () => {
      const mockTasks = [
        { 
          id: 'task1', 
          title: 'Client Task 1',
          description: 'Client Description 1',
          clientId: 'client1', 
          status: 'todo',
          priority: 'medium',
          dueDate: null,
          assignedTo: null,
          inquiryId: null,
          tags: [],
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prismaService.task, 'findMany').mockResolvedValue(mockTasks as any);

      const result = await service.getTasksByClient('client1');

      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { clientId: 'client1' },
        orderBy: [
          { status: 'asc' },
          { order: 'asc' },
        ],
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTasksByInquiry', () => {
    it('should return tasks for a specific inquiry', async () => {
      const mockTasks = [
        { 
          id: 'task1', 
          title: 'Inquiry Task 1',
          description: 'Inquiry Description 1',
          inquiryId: 'inquiry1', 
          status: 'todo',
          priority: 'medium',
          dueDate: null,
          assignedTo: null,
          clientId: null,
          tags: [],
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prismaService.task, 'findMany').mockResolvedValue(mockTasks as any);

      const result = await service.getTasksByInquiry('inquiry1');

      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { inquiryId: 'inquiry1' },
        orderBy: [
          { status: 'asc' },
          { order: 'asc' },
        ],
      });
      expect(result).toEqual(mockTasks);
    });
  });
});