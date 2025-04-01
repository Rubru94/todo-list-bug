import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks(userId: string): Promise<Task[]> {
        const tasks = await this.tasksRepository.find({
            where: { owner: { id: userId } },
        });

        this.logger.log(`Retrieved all tasks for user: ${userId}`);
        return tasks;
    }

    async getTask(id: string, userId: string): Promise<Task> {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.owner', 'owner')
            .where('task.id = :id', { id })
            .getOne();

        if (!task) throw new NotFoundException('Task id does not exist');

        const { owner } = task;
        if (owner.id !== userId)
            throw new UnauthorizedException(
                'You do not have permissions for this task',
            );
        // Remove owner property from task object for this specific case
        // other solution could be to use a type Omit<Task, 'owner'>
        delete task.owner;

        this.logger.log(`Retrieved task: ${id} for user: ${userId}`);
        return task;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        userId: string,
    ): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            owner: { id: userId },
        });

        const savedTask = await this.tasksRepository.save(task);

        this.logger.log(`Created task: ${savedTask.id} for user: ${userId}`);
        return savedTask;
    }

    async editTask(
        { id, ...rest }: EditTaskDto,
        userId: string,
    ): Promise<Task> {
        await this.getTask(id, userId);
        await this.tasksRepository.update(id, rest);

        const editedTask = await this.getTask(id, userId);

        this.logger.log(`Edited task: ${editedTask.id} for user: ${userId}`);
        return editedTask;
    }
}
