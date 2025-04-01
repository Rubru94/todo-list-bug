import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto';

const mockTaskRepository = {
    find: jest.fn(),
    createQueryBuilder: jest
        .fn()
        .mockReturnValue({
            where: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getOne: jest.fn(),
        }),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
};

describe('TasksService', () => {
    let service: TasksService;
    let tasksRepository: Repository<Task>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: getRepositoryToken(Task),
                    useValue: mockTaskRepository,
                },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        tasksRepository = module.get<Repository<Task>>(
            getRepositoryToken(Task),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('listTasks', () => {
        const userId = '1';

        it('should return an array of tasks for the given user', async () => {
            const tasks = [
                {
                    id: '1',
                    title: 'Task 1',
                    description: 'Desc 1',
                    done: true,
                    dueDate: '2025-05-22 09:13:18.988',
                    owner: { id: userId },
                },
                {
                    id: '2',
                    title: 'Task 2',
                    description: 'Desc 2',
                    done: true,
                    dueDate: '2025-05-22 09:13:18.988',
                    owner: { id: userId },
                },
            ];
            jest.spyOn(tasksRepository, 'find').mockResolvedValue(
                tasks as Task[],
            );

            const result = await service.listTasks(userId);

            expect(result).toEqual(tasks);
            expect(tasksRepository.find).toHaveBeenCalledWith({
                where: { owner: { id: userId } },
            });
        });

        it('should return an empty array if no tasks are found for the given user', async () => {
            const tasks = [];
            jest.spyOn(tasksRepository, 'find').mockResolvedValue(
                tasks as Task[],
            );

            const result = await service.listTasks(userId);

            expect(result).toEqual(tasks);
            expect(tasksRepository.find).toHaveBeenCalledWith({
                where: { owner: { id: userId } },
            });
        });
    });

    describe('getTask', () => {
        let spyGetOne: jest.SpyInstance;
        let mockTask: Task;

        beforeEach(() => {
            spyGetOne = jest.spyOn(
                tasksRepository.createQueryBuilder(),
                'getOne',
            );
            mockTask = {
                id: '1',
                owner: { id: 'user1' },
                title: 'Test Task',
            } as Task;
        });

        it('should return the task if user is the owner', async () => {
            spyGetOne.mockResolvedValue(mockTask);

            const result = await service.getTask('1', 'user1');

            expect(tasksRepository.createQueryBuilder).toHaveBeenCalled();
            expect(result).toEqual(mockTask);
        });

        it('should throw a NotFoundException if task is not found', async () => {
            spyGetOne.mockResolvedValue(null);

            await expect(service.getTask('1', 'user1')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw a UnauthorizedException if task owner is invalid', async () => {
            spyGetOne.mockResolvedValue(mockTask);

            await expect(service.getTask('1', 'user2')).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    it('should return created task successfully', async () => {
        const createTaskDto = {
            title: 'Created Task',
            description: 'Created Task',
        } as CreateTaskDto;
        const userId = 'user1';
        const task = { ...createTaskDto, owner: { id: userId } };
        const savedTask = { ...task, id: 'task-id' };

        mockTaskRepository.create.mockReturnValue(task);
        mockTaskRepository.save.mockResolvedValue(savedTask);

        const result = await service.createTask(createTaskDto, userId);

        expect(result).toEqual(savedTask);
        expect(mockTaskRepository.create).toHaveBeenCalledWith({
            ...createTaskDto,
            owner: { id: userId },
        });
        expect(mockTaskRepository.save).toHaveBeenCalledWith(task);
    });

    it('should return edited task if user is the owner', async () => {
        const mockTask = {
            id: '1',
            owner: { id: 'user1' },
            title: 'Updated Task',
        };
        jest.spyOn(service, 'getTask').mockResolvedValue(mockTask as Task);

        const result = await service.editTask(
            { id: '1', title: 'Updated Task' },
            'user1',
        );

        expect(result).toEqual(mockTask);
        expect(service.getTask).toHaveBeenCalledTimes(2);
        expect(tasksRepository.update).toHaveBeenCalledWith('1', {
            title: 'Updated Task',
        });
    });
});
