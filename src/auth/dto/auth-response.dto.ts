import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
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
  @IsEmail()
  @IsNotEmpty()
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
  @IsString()
  @IsNotEmpty()
  @Length(6, 10)
  token: string;

  @ApiProperty({
    example: 'novaSenha123',
    description: 'Nova senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 128)
  newPassword: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    example: 'Password reset successfully',
    description: 'Mensagem de confirmação',
  })
  message: string;
}
