import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    async listTasks(@GetUser('id') userId: string): Promise<Task[]> {
        return this.tasksService.listTasks(userId);
    }

    @Get('/:id')
    async getTask(
        @Param('id') id: string,
        @GetUser('id') userId: string,
    ): Promise<Task> {
        return this.tasksService.getTask(id, userId);
    }

    @Post()
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser('id') userId: string,
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, userId);
    }

    @Post('/edit')
    async editTask(
        @Body() editTaskDto: EditTaskDto,
        @GetUser('id') userId: string,
    ): Promise<Task> {
        return this.tasksService.editTask(editTaskDto, userId);
    }
}
