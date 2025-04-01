import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    pass: string;
}
