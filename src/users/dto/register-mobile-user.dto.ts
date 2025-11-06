import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterMobileUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário mobile',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({
    example: 'joao.mobile@example.com',
    description: 'Email único para acesso à plataforma mobile',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'minhasenha123',
    description: 'Senha para acesso à conta (mínimo 6 caracteres)',
    minLength: 6,
    format: 'password',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;
}
