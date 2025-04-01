import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    fullname: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    pass: string;
}
