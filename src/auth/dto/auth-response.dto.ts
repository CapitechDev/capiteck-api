import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: {
      id: '507f1f77bcf86cd799439011',
      email: 'joao@example.com',
      name: 'João Silva',
      role: 'USER',
    },
    description: 'Dados do usuário',
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT para autenticação',
  })
  token: string;
}

export class ForgotPasswordRequestDto {
  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do usuário para recuperação de senha',
  })
  email: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'Reset token sent to email',
    description: 'Mensagem de confirmação',
  })
  message: string;
}

export class ResetPasswordRequestDto {
  @ApiProperty({
    example: 'A7B2X9',
    description: 'Token de 6 dígitos recebido por email',
  })
  token: string;

  @ApiProperty({
    example: 'novaSenha123',
    description: 'Nova senha do usuário',
  })
  newPassword: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    example: 'Password reset successfully',
    description: 'Mensagem de confirmação',
  })
  message: string;
}
