import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser: Omit<User, 'password'> = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    resetToken: null,
    resetTokenExpires: null,
  };

  const mockLoginResponse = {
    user: {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    },
    token: 'jwt.token.here',
  };

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
      login: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return login response', async () => {
      const mockRequest = {
        user: mockUser,
      } as Request & { user: Omit<User, 'password'> };

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockRequest);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const mockRequest = {
        user: mockUser,
      } as Request & { user: Omit<User, 'password'> };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });

  describe('forgotPassword', () => {
    it('should return success message when email is provided', async () => {
      const email = 'test@example.com';
      const expectedResponse = { message: 'Reset token sent to email' };

      authService.forgotPassword.mockResolvedValue(expectedResponse);

      const result = await controller.forgotPassword({ email });

      expect(authService.forgotPassword).toHaveBeenCalledWith(email);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('resetPassword', () => {
    it('should return success message when token and newPassword are provided', async () => {
      const resetPasswordDto = {
        token: 'validToken',
        newPassword: 'newPassword123',
      };
      const expectedResponse = { message: 'Password reset successfully' };

      authService.resetPassword.mockResolvedValue(expectedResponse);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});
