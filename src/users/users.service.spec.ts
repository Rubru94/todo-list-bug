import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUsersRepository = { findOneBy: jest.fn(), save: jest.fn() };

describe('UsersService', () => {
    let service: UsersService;
    let usersRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUsersRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        usersRepository = module.get<Repository<User>>(
            getRepositoryToken(User),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        let spyFindOneBy: jest.SpyInstance;

        beforeEach(() => {
            spyFindOneBy = jest.spyOn(usersRepository, 'findOneBy');
        });

        it('should return user when found by email', async () => {
            const mockUser = { id: '1', email: 'test@example.com' };
            spyFindOneBy.mockResolvedValue(mockUser as User);

            const result = await service.findOne('test@example.com');

            expect(result).toEqual(mockUser);
            expect(usersRepository.findOneBy).toHaveBeenCalledWith({
                email: 'test@example.com',
            });
        });

        it('should return null if user is not found', async () => {
            spyFindOneBy.mockResolvedValue(null);

            const result = await service.findOne('test@example.com');

            expect(result).toBeNull();
            expect(usersRepository.findOneBy).toHaveBeenCalledWith({
                email: 'test@example.com',
            });
        });
    });

    describe('create', () => {
        let spyFindOne: jest.SpyInstance;

        beforeEach(() => {
            spyFindOne = jest.spyOn(service, 'findOne');
        });

        it('should return new user created successfully', async () => {
            const createUserDto = {
                email: 'new@example.com',
                fullname: 'Test User',
                pass: '12345',
            };
            const mockUser = new User(createUserDto);

            spyFindOne.mockResolvedValue(null);
            jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);

            const result = await service.create(createUserDto);

            expect(result).toEqual(mockUser);
            expect(service.findOne).toHaveBeenCalledWith('new@example.com');
            expect(usersRepository.save).toHaveBeenCalledWith(createUserDto);
        });

        it('should throw ConflictException if email already exists', async () => {
            const createUserDto = {
                email: 'existing@example.com',
                fullname: 'Test User',
                pass: '12345',
            };
            const existingUser = {
                id: '1',
                email: 'existing@example.com',
            } as User;
            spyFindOne.mockResolvedValue(existingUser);

            await expect(service.create(createUserDto)).rejects.toThrow(
                ConflictException,
            );
            expect(service.findOne).toHaveBeenCalledWith(
                'existing@example.com',
            );
        });
    });
});
