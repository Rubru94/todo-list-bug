import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    done: boolean;

    @IsNotEmpty()
    @IsString()
    dueDate: string;
}
