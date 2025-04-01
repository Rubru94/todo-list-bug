import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/create')
    async create(@Body() body: CreateUserDto): Promise<User> {
        return this.usersService.create(body);
    }
}
