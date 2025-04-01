import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthenticatedUserDto } from './dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(mail: string, pass: string): Promise<AuthenticatedUserDto> {
        const user = await this.usersService.findOne(mail);

        const emailNotFoundMsg = `User with email ${mail} not found`;
        const passNotFoundMsg = `Invalid password for user with email ${mail}`;

        if (!user) {
            this.logger.error(emailNotFoundMsg);
            throw new NotFoundException(emailNotFoundMsg);
        }

        if (user?.pass !== pass) {
            this.logger.error(passNotFoundMsg);
            throw new UnauthorizedException(passNotFoundMsg);
        }

        const { id, email } = user;

        this.logger.log(`User ${email} logged successfully`);

        return {
            access_token: await this.jwtService.signAsync(
                { id, email },
                { expiresIn: '1h' },
            ),
        };
    }
}
