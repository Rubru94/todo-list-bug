import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    async listTasks(@Request() req): Promise<Task[]> {
        return this.tasksService.listTasks(req.user.id);
    }

    @Get('/:id')
    async getTask(@Param('id') id: string, @Request() req): Promise<Task> {
        return this.tasksService.getTask(id, req.user.id);
    }

    @Post('/edit')
    async editTask(
        @Body() editTaskDto: EditTaskDto,
        @Request() req,
    ): Promise<Task> {
        return this.tasksService.editTask(editTaskDto, req.user.id);
    }
}
