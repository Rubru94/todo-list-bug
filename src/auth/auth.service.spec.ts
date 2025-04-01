import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: { findOne: jest.fn() } },
                { provide: JwtService, useValue: { signAsync: jest.fn() } },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should throw NotFoundException if user is not found', async () => {
        jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

        await expect(
            service.signIn('test@example.com', 'password'),
        ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
        jest.spyOn(usersService, 'findOne').mockResolvedValue({
            id: '1',
            email: 'test@example.com',
            pass: 'wrongpassword',
            fullname: 'Test User',
            tasks: [],
        });

        await expect(
            service.signIn('test@example.com', 'password'),
        ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access token if credentials are valid', async () => {
        const user = {
            id: '1',
            email: 'test@example.com',
            pass: 'password',
            fullname: 'Test User',
            tasks: [],
        };
        const token = 'mockToken';

        jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
        jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

        const result = await service.signIn('test@example.com', 'password');

        expect(result).toEqual({ access_token: token });
    });
});
