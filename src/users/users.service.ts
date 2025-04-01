import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.findOne(createUserDto.email);

        if (existingUser)
            throw new ConflictException('User email already exist');

        const user = new User(createUserDto);

        await this.usersRepository.save(user);

        this.logger.log(`User created successfully: ${user.email}`);

        return user;
    }

    async findOne(email: string): Promise<User> {
        const user = await this.usersRepository.findOneBy({ email });

        return user;
    }
}
