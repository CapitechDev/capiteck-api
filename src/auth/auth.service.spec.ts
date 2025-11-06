import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let emailService: jest.Mocked<EmailService>;

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

  beforeEach(async () => {
    const mockUsersService = {
      findOneByEmail: jest.fn(),
      updateResetToken: jest.fn(),
      findByResetToken: jest.fn(),
      updatePasswordAndClearToken: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockEmailService = {
      sendResetToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    emailService = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      usersService.findOneByEmail.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const result = await service.validateUser(mockUser.email, plainPassword);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        resetToken: mockUser.resetToken,
        resetTokenExpires: mockUser.resetTokenExpires,
      });
    });

    it('should return null when user is not found', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password',
      );

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        mockUser.email,
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return user data and JWT token', async () => {
      const mockToken = 'jwt.token.here';
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.name,
        sub: mockUser.id,
        role: mockUser.role,
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
        token: mockToken,
      });
    });
  });

  describe('forgotPassword', () => {
    it('should send reset token when user exists', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      usersService.updateResetToken.mockResolvedValue(mockUser);
      emailService.sendResetToken.mockResolvedValue({
        messageId: '123',
        envelope: { from: '', to: [] },
        accepted: [],
        rejected: [],
        pending: [],
        response: '250 OK',
      });

      const result = await service.forgotPassword(mockUser.email);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(usersService.updateResetToken).toHaveBeenCalled();
      expect(emailService.sendResetToken).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Reset token sent to email' });
    });

    it('should throw error when user is not found', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);

      await expect(
        service.forgotPassword('nonexistent@example.com'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully with valid token', async () => {
      const newPassword = 'newPassword123';
      const token = 'validToken';
      const futureDate = new Date(Date.now() + 60 * 1000); // 1 minute from now

      usersService.findByResetToken.mockResolvedValue({
        ...mockUser,
        resetTokenExpires: futureDate,
      });
      usersService.updatePasswordAndClearToken.mockResolvedValue(mockUser);

      const result = await service.resetPassword(token, newPassword);

      expect(usersService.findByResetToken).toHaveBeenCalledWith(token);
      expect(usersService.updatePasswordAndClearToken).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Password reset successfully' });
    });

    it('should throw error when token is invalid', async () => {
      usersService.findByResetToken.mockResolvedValue(null);

      await expect(
        service.resetPassword('invalidToken', 'newPassword'),
      ).rejects.toThrow('Invalid or expired reset token');
    });

    it('should throw error when token is expired', async () => {
      const pastDate = new Date(Date.now() - 60 * 1000); // 1 minute ago

      usersService.findByResetToken.mockResolvedValue({
        ...mockUser,
        resetTokenExpires: pastDate,
      });

      await expect(
        service.resetPassword('expiredToken', 'newPassword'),
      ).rejects.toThrow('Reset token has expired');
    });

    it('should throw error when resetTokenExpires is null', async () => {
      usersService.findByResetToken.mockResolvedValue({
        ...mockUser,
        resetTokenExpires: null,
      });

      await expect(
        service.resetPassword('tokenWithoutExpiry', 'newPassword'),
      ).rejects.toThrow('Reset token has expired');
    });
  });
});
