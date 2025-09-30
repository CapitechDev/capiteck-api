import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAdminUserDto {
  @ApiProperty({ 
    description: 'Nome do usuário admin',
    example: 'João Silva'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({ 
    description: 'Email do usuário admin',
    example: 'joao@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Senha do usuário admin',
    example: 'senha123'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({ 
    description: 'Código de autorização para criar admin',
    example: 'ADMIN_SECRET_CODE'
  })
  @IsNotEmpty()
  @IsString()
  adminCode: string;
}
