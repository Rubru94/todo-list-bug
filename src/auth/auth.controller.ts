import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './is-public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @IsPublic()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() { email, pass }: SignInDto): Promise<AuthenticatedUserDto> {
        return this.authService.signIn(email, pass);
    }
}
