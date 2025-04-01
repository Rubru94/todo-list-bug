import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    done?: boolean;

    @IsOptional()
    @IsString()
    dueDate?: string;
}
