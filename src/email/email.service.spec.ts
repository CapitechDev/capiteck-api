import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let mockTransporter: jest.Mocked<nodemailer.Transporter>;

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockResetToken = '123456';

  beforeEach(async () => {
    // Mock do nodemailer.createTransport
    mockTransporter = {
      sendMail: jest.fn(),
    } as any;

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create transporter with gmail service', () => {
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
  });

  describe('sendResetToken', () => {
    it('should send reset token email successfully', async () => {
      const mockSendMailResult = { messageId: '12345' };
      mockTransporter.sendMail.mockResolvedValue(mockSendMailResult);

      const result = await service.sendResetToken(mockUser, mockResetToken);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.GOOGLE_EMAIL,
        to: mockUser.email,
        subject: 'Recuperação de Senha - Capitech',
        html: expect.stringContaining(`Olá, ${mockUser.name}`),
      });

      expect(result).toEqual(mockSendMailResult);
    });

    it('should include correct email content', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: '12345' });

      await service.sendResetToken(mockUser, mockResetToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];

      expect(callArgs.html).toContain(`Olá, ${mockUser.name}`);
      expect(callArgs.html).toContain(
        'Você solicitou a recuperação de sua senha',
      );
      expect(callArgs.html).toContain(mockResetToken);
      expect(callArgs.html).toContain('Este token é válido por 15 minutos');
      expect(callArgs.html).toContain('Equipe Capitech');
    });

    it('should use correct email configuration', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: '12345' });

      await service.sendResetToken(mockUser, mockResetToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];

      expect(callArgs.from).toBe(process.env.GOOGLE_EMAIL);
      expect(callArgs.to).toBe(mockUser.email);
      expect(callArgs.subject).toBe('Recuperação de Senha - Capitech');
    });

    it('should handle sendMail errors', async () => {
      const mockError = new Error('Failed to send email');
      mockTransporter.sendMail.mockRejectedValue(mockError);

      await expect(
        service.sendResetToken(mockUser, mockResetToken),
      ).rejects.toThrow('Failed to send email');
    });

    it('should send email with different user data', async () => {
      const differentUser = {
        email: 'another@example.com',
        name: 'Another User',
      };
      const differentToken = 'abcdef';

      mockTransporter.sendMail.mockResolvedValue({ messageId: '67890' });

      await service.sendResetToken(differentUser, differentToken);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];

      expect(callArgs.to).toBe(differentUser.email);
      expect(callArgs.html).toContain(`Olá, ${differentUser.name}`);
      expect(callArgs.html).toContain(differentToken);
    });
  });
});
