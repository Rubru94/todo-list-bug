import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EditTaskDto } from './dto/edit-task.dto';
import { Task } from '../entities/task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get('')
    async listTasks(): Promise<Task[]> {
        return this.tasksService.listTasks();
    }

    @Get('/:id')
    async getTask(@Param('id') id: string): Promise<Task> {
        return this.tasksService.getTask(id);
    }

    @Post('/edit')
    async editTask(@Body() body: EditTaskDto): Promise<Task> {
        return this.tasksService.editTask(body);
    }
}
