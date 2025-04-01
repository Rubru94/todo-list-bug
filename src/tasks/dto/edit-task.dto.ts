import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class EditTaskDto extends PartialType(CreateTaskDto) {
    @IsNotEmpty()
    @IsString()
    id: string;
}
