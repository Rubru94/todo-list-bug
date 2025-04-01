import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateTaskDto, EditTaskDto } from './dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    async listAll(@GetUser('id') userId: string): Promise<Task[]> {
        return this.tasksService.listAll(userId);
    }

    @Get('/:id')
    async getById(
        @Param('id') id: string,
        @GetUser('id') userId: string,
    ): Promise<Task> {
        return this.tasksService.getById(id, userId);
    }

    @Post()
    async create(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser('id') userId: string,
    ): Promise<Task> {
        return this.tasksService.create(createTaskDto, userId);
    }

    @Post('/edit')
    async edit(
        @Body() editTaskDto: EditTaskDto,
        @GetUser('id') userId: string,
    ): Promise<Task> {
        return this.tasksService.edit(editTaskDto, userId);
    }
}
