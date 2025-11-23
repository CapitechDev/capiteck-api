import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository, SafeUser } from './users.repository';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    resetToken: null,
    resetTokenExpires: null,
  };

  const mockSafeUser: SafeUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    resetToken: null,
    resetTokenExpires: null,
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByRole: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      existsByEmail: jest.fn(),
      existsById: jest.fn(),
      findByResetToken: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should return user when email is provided', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@example.com');

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException when email is empty', async () => {
      await expect(service.findOneByEmail('')).rejects.toThrow(
        'Email inválido',
      );
    });
  });

  describe('findOneById', () => {
    it('should return safe user', async () => {
      usersRepository.findById.mockResolvedValue(mockSafeUser);

      const result = await service.findOneById('1');

      expect(usersRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockSafeUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [mockSafeUser];
      usersRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(usersRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findMobileUsers', () => {
    it('should return users with USER role', async () => {
      const mockUsers = [mockSafeUser];
      usersRepository.findByRole.mockResolvedValue(mockUsers);

      const result = await service.findMobileUsers();

      expect(usersRepository.findByRole).toHaveBeenCalledWith('USER');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('createAdminUser', () => {
    const adminUserDto = {
      adminCode: 'Fatec2024Votorantim',
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
    };

    it('should create admin user successfully', async () => {
      configService.get.mockReturnValue('Fatec2024Votorantim');
      usersRepository.existsByEmail.mockResolvedValue(false);
      usersRepository.create.mockResolvedValue(mockSafeUser);

      const result = await service.createAdminUser(adminUserDto);

      expect(configService.get).toHaveBeenCalledWith('ADMIN_CODE');
      expect(usersRepository.existsByEmail).toHaveBeenCalledWith(
        adminUserDto.email,
      );
      expect(usersRepository.create).toHaveBeenCalledWith({
        name: adminUserDto.name,
        email: adminUserDto.email,
        password: expect.any(String), // hashed password
        role: 'ADMIN',
      });
      expect(result).toEqual(mockSafeUser);
    });

    it('should throw UnauthorizedException when admin code is invalid', async () => {
      configService.get.mockReturnValue('WrongCode');

      await expect(service.createAdminUser(adminUserDto)).rejects.toThrow(
        'Usuário não autorizado.',
      );
    });

    it('should throw BadRequestException when user already exists', async () => {
      configService.get.mockReturnValue('Fatec2024Votorantim');
      usersRepository.existsByEmail.mockResolvedValue(true);

      await expect(service.createAdminUser(adminUserDto)).rejects.toThrow(
        'Usuário já cadastrado.',
      );
    });
  });

  describe('createMobileUser', () => {
    const mobileUserDto = {
      email: 'mobile@example.com',
      password: 'password123',
      name: 'Mobile User',
    };

    it('should create mobile user successfully', async () => {
      usersRepository.existsByEmail.mockResolvedValue(false);
      usersRepository.create.mockResolvedValue(mockSafeUser);

      const result = await service.createMobileUser(mobileUserDto);

      expect(usersRepository.existsByEmail).toHaveBeenCalledWith(
        mobileUserDto.email,
      );
      expect(usersRepository.create).toHaveBeenCalledWith({
        name: mobileUserDto.name,
        email: mobileUserDto.email,
        password: expect.any(String), // hashed password
        role: 'USER',
      });
      expect(result).toEqual(mockSafeUser);
    });

    it('should throw BadRequestException when user already exists', async () => {
      usersRepository.existsByEmail.mockResolvedValue(true);

      await expect(service.createMobileUser(mobileUserDto)).rejects.toThrow(
        'Usuário já cadastrado.',
      );
    });
  });

  describe('updateAdminUser', () => {
    const updateDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
      password: 'newpassword123',
    };

    it('should update admin user successfully', async () => {
      usersRepository.existsById.mockResolvedValue(true);
      usersRepository.update.mockResolvedValue(mockSafeUser);

      const result = await service.updateAdminUser('1', updateDto);

      expect(usersRepository.existsById).toHaveBeenCalledWith('1');
      expect(usersRepository.update).toHaveBeenCalledWith('1', {
        name: updateDto.name,
        email: updateDto.email,
        password: expect.any(String), // hashed password
      });
      expect(result).toEqual(mockSafeUser);
    });

    it('should update admin user without password', async () => {
      const updateDtoWithoutPassword = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      usersRepository.existsById.mockResolvedValue(true);
      usersRepository.update.mockResolvedValue(mockSafeUser);

      const result = await service.updateAdminUser(
        '1',
        updateDtoWithoutPassword,
      );

      expect(usersRepository.update).toHaveBeenCalledWith('1', {
        name: updateDtoWithoutPassword.name,
        email: updateDtoWithoutPassword.email,
        password: undefined,
      });
      expect(result).toEqual(mockSafeUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.existsById.mockResolvedValue(false);

      await expect(service.updateAdminUser('1', updateDto)).rejects.toThrow(
        'Usuário não encontrado.',
      );
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const result = await service.validatePassword(
        plainPassword,
        hashedPassword,
      );

      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      const result = await service.validatePassword(
        'wrongpassword',
        hashedPassword,
      );

      expect(result).toBe(false);
    });
  });

  describe('updateResetToken', () => {
    it('should update reset token', async () => {
      const resetToken = 'token123';
      const expires = new Date();
      usersRepository.update.mockResolvedValue(mockSafeUser);

      const result = await service.updateResetToken('1', resetToken, expires);

      expect(usersRepository.update).toHaveBeenCalledWith('1', {
        resetToken,
        resetTokenExpires: expires,
      });
      expect(result).toEqual(mockSafeUser);
    });
  });

  describe('findByResetToken', () => {
    it('should find user by reset token', async () => {
      usersRepository.findByResetToken.mockResolvedValue(mockUser);

      const result = await service.findByResetToken('token123');

      expect(usersRepository.findByResetToken).toHaveBeenCalledWith('token123');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updatePasswordAndClearToken', () => {
    it('should update password and clear token', async () => {
      const hashedPassword = 'newHashedPassword';
      usersRepository.update.mockResolvedValue(mockSafeUser);

      const result = await service.updatePasswordAndClearToken(
        '1',
        hashedPassword,
      );

      expect(usersRepository.update).toHaveBeenCalledWith('1', {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      });
      expect(result).toEqual(mockSafeUser);
    });
  });
});
